from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List, Optional

from app.services.data_fetcher import fetch_stock_data, fetch_stock_info, fetch_stock_news
from app.services.feature_engineering import add_technical_indicators, get_latest_indicators, calculate_returns
from app.services.model import train_and_predict
from app.services.explanation import generate_explanation
from app.services.nlp_parser import extract_ticker_from_query
from app.utils.helpers import format_percentage
from app.routes.auth import get_current_user
from app.models.user import UserInDB, SearchHistory
from app.database import get_database

router = APIRouter()

class ForecastRequest(BaseModel):
    stock_name: str
    timeframe: str = "1mo"

class ForecastResponse(BaseModel):
    stock_name: str          # Resolved ticker (e.g. IBM)
    original_query: str      # Raw user input (e.g. "IBM stock price will increase in 6 months")
    prediction: str
    confidence: float
    explanation: str
    indicators: Dict[str, Any]
    chart_data: Dict[str, List[Any]]
    current_price: Optional[float] = None
    currency: Optional[str] = "USD"

@router.post("/forecast", response_model=ForecastResponse)
async def get_forecast(request: ForecastRequest, current_user: UserInDB = Depends(get_current_user)):
    try:
        original_query = request.stock_name.strip()

        # 0. NLP: Resolve natural language query → ticker + timeframe
        ticker, extracted_timeframe = extract_ticker_from_query(original_query)
        # If the user provided an explicit timeframe in the request, prefer that
        timeframe = request.timeframe if request.timeframe != "1mo" else extracted_timeframe

        print(f"[NLP] Query: '{original_query}' → Ticker: '{ticker}' | Timeframe: {timeframe}")

        # 1. Fetch Data
        df = fetch_stock_data(ticker, period="5y")
        info = fetch_stock_info(ticker)
        news = fetch_stock_news(ticker)

        # 2. Feature Engineering
        df_indicators = add_technical_indicators(df.copy())
        latest_indicators = get_latest_indicators(df_indicators)
        returns = calculate_returns(df)

        # 3. Model Prediction
        prediction, confidence = train_and_predict(df_indicators.copy())

        # 4. Extract current price for the result card
        current_price = info.get("current_price")
        if current_price == "N/A" or current_price is None:
            # Fallback: use the last closing price from the dataframe
            try:
                current_price = round(float(df['Close'].iloc[-1]), 2)
            except Exception:
                current_price = None

        try:
            current_price = round(float(current_price), 2) if current_price else None
        except (TypeError, ValueError):
            current_price = None

        currency = info.get("currency", "USD") or "USD"

        # 5. Generate Explanation (LLM)
        explanation = await generate_explanation(
            stock_name=ticker,
            prediction=prediction,
            confidence=confidence,
            indicators=latest_indicators,
            info=info,
            news=news,
            returns=returns,
            user_query=original_query,
            timeframe=timeframe
        )

        # 6. Prepare Chart Data (Last 6 months)
        df_recent = df.tail(126)
        chart_data = {
            "dates": df_recent.index.strftime('%Y-%m-%d').tolist(),
            "prices": df_recent['Close'].tolist(),
            "volumes": df_recent['Volume'].tolist()
        }

        # 7. Save to History (store resolved ticker, not raw query)
        db = get_database()
        if db is not None:
            history_entry = SearchHistory(
                user_email=current_user.email,
                stock_name=ticker,
                prediction=prediction,
                confidence=round(confidence, 2)
            )
            await db.history.insert_one(history_entry.model_dump())

        return ForecastResponse(
            stock_name=ticker,
            original_query=original_query,
            prediction=prediction,
            confidence=round(confidence, 2),
            explanation=explanation,
            indicators=latest_indicators,
            chart_data=chart_data,
            current_price=current_price,
            currency=currency
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
