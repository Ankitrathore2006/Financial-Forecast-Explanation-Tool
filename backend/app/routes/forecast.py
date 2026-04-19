from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List

from app.services.data_fetcher import fetch_stock_data, fetch_stock_info, fetch_stock_news
from app.services.feature_engineering import add_technical_indicators, get_latest_indicators, calculate_returns
from app.services.model import train_and_predict
from app.services.explanation import generate_explanation
from app.utils.helpers import format_percentage
from app.routes.auth import get_current_user
from app.models.user import UserInDB, SearchHistory
from app.database import get_database

router = APIRouter()

class ForecastRequest(BaseModel):
    stock_name: str
    timeframe: str = "1mo" # Not heavily used for ML, but could be parameter

class ForecastResponse(BaseModel):
    stock_name: str
    prediction: str
    confidence: float
    explanation: str
    indicators: Dict[str, Any]
    chart_data: Dict[str, List[Any]]

@router.post("/forecast", response_model=ForecastResponse)
async def get_forecast(request: ForecastRequest, current_user: UserInDB = Depends(get_current_user)):
    try:
        # 1. Fetch Data
        df = fetch_stock_data(request.stock_name, period="5y")
        info = fetch_stock_info(request.stock_name)
        news = fetch_stock_news(request.stock_name)
        
        # 2. Feature Engineering
        df_indicators = add_technical_indicators(df.copy())
        latest_indicators = get_latest_indicators(df_indicators)
        returns = calculate_returns(df)
        
        # 3. Model Prediction
        prediction, confidence = train_and_predict(df_indicators.copy())
        
        # 4. Generate Explanation (LLM)
        explanation = await generate_explanation(
            stock_name=request.stock_name,
            prediction=prediction,
            confidence=confidence,
            indicators=latest_indicators,
            info=info,
            news=news,
            returns=returns
        )
        
        # 5. Prepare Chart Data (Last 6 months for clear visualization)
        df_recent = df.tail(126) # ~6 months trading days
        chart_data = {
            "dates": df_recent.index.strftime('%Y-%m-%d').tolist(),
            "prices": df_recent['Close'].tolist(),
            "volumes": df_recent['Volume'].tolist() # Added volume for SaaS UI
        }
        
        # 6. Save to History
        db = get_database()
        if db is not None:
            history_entry = SearchHistory(
                user_email=current_user.email,
                stock_name=request.stock_name,
                prediction=prediction,
                confidence=round(confidence, 2)
            )
            await db.history.insert_one(history_entry.model_dump())
        
        return ForecastResponse(
            stock_name=request.stock_name,
            prediction=prediction,
            confidence=round(confidence, 2),
            explanation=explanation,
            indicators=latest_indicators,
            chart_data=chart_data
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=List[SearchHistory])
async def get_history(current_user: UserInDB = Depends(get_current_user)):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    cursor = db.history.find({"user_email": current_user.email}).sort("timestamp", -1).limit(10)
    history = await cursor.to_list(length=10)
    return history

