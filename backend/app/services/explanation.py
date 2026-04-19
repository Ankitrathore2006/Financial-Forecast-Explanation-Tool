import httpx
from app.config.settings import settings
import json

async def generate_explanation(
    stock_name: str,
    prediction: str,
    confidence: float,
    indicators: dict,
    info: dict,
    news: str,
    returns: dict
) -> str:
    """Generate the structured explanation using OpenRouter/LLM."""
    
    prompt = f"""
You are a professional financial analyst AI.

Your task is to analyze a given stock using structured, data-driven reasoning and provide a clear, unbiased, and beginner-friendly explanation.

---

## 📥 Input Data:
Stock Name: {stock_name}
Model Prediction: {prediction} with {confidence:.2f}% confidence

Technical Indicators:
- RSI: {indicators.get('rsi')}
- MACD: {indicators.get('macd')}
- Moving Average Trend: {indicators.get('ma_trend')}
- Volume Trend: {indicators.get('volume_trend')}

Fundamental Data:
- Revenue Growth: {info.get('revenue_growth')}
- Profit Growth: {info.get('profit_growth')}
- Debt Level: {info.get('debt')}
- ROE: {info.get('roe')}
- ROCE: {info.get('roce')}
- PE Ratio: {info.get('pe_ratio')}
- Industry PE: {info.get('industry_pe')}
- Promoter Holding: {info.get('promoter_holding')}

News Sentiment:
{news}

Past Performance:
- 1 Year Return: {returns.get('return_1y')}
- 3 Year Return: {returns.get('return_3y')}
- 5 Year Return: {returns.get('return_5y')}

---

## 📊 Instructions:

Generate a high-fidelity intelligence report. 

STRICTLY use the following header format (## [icon_name] [Title]) for each section so the UI can parse it correctly:

## psychology Overall Verdict
- Summarize long-term/short-term outlook.
- Sentiment (Bullish/Bearish/Sideways).

## newspaper Latest News & Impact
- Summarize key news and their direct impact on stock price.

## analytics Technical Analysis
- Interpret RSI, MACD, Volume, and Trends.

## account_balance Fundamental Analysis
- Evaluate Revenue, Profit, Debt, PE, ROE, ROCE.

## bar_chart Past Performance
- Analyze 1Y, 3Y, 5Y returns.

## warning Risks
- Detail company, sector, and market risks.

## auto_awesome Final Insight
- Clear summary: "Avoid" or "Opportunity".
- Simple language logic.

---

## 🎯 Output Style:
- Use clear bullet points.
- **Topic-wise breakdown:** Start each point with a bolded topic (e.g., - **Growth Trend:** ...).
- **Spacing:** Ensure there is a blank line between different points or topics to avoid dense text blocks.
- **Readable Structure:** Use sub-points if a topic is complex.
- Keep explanation crisp but extremely professional.
- Use simple terms for beginners where possible.
- DO NOT use bolding within the main headers (only use ## icon Title).
"""

    if settings.GEMINI_API_KEY:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.MODEL_NAME}:generateContent?key={settings.GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, headers=headers, json=payload, timeout=60.0)
                response.raise_for_status()
                data = response.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
            except Exception as e:
                return f"Error generating explanation with Gemini: {str(e)}"

    if not settings.OPENROUTER_API_KEY:
        # Fallback dummy explanation if no API key
        return f"Mock Explanation for {stock_name}:\n\n## 1. 📊 Overall Verdict\n- Bullish (Short-term)\n- Confidence: {confidence:.2f}%\n\nPlease set OPENROUTER_API_KEY or GEMINI_API_KEY to get real analysis."

    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": settings.MODEL_NAME,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=60.0
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Error generating explanation with OpenRouter: {str(e)}"
