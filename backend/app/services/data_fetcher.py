import yfinance as yf
import pandas as pd
from typing import Dict, Any
import httpx
from app.config.settings import settings

import numpy as np

def generate_mock_data(ticker_symbol: str) -> pd.DataFrame:
    """Generate 5 years of daily mock data for demonstration."""
    dates = pd.date_range(end=pd.Timestamp.today(), periods=1260, freq='B')
    # Random walk
    returns = np.random.normal(0.0005, 0.02, size=len(dates))
    prices = 100 * np.exp(np.cumsum(returns))
    
    df = pd.DataFrame(index=dates, data={
        'Open': prices * np.random.uniform(0.99, 1.01, size=len(dates)),
        'High': prices * np.random.uniform(1.00, 1.02, size=len(dates)),
        'Low': prices * np.random.uniform(0.98, 1.00, size=len(dates)),
        'Close': prices,
        'Volume': np.random.randint(100000, 5000000, size=len(dates))
    })
    return df

def fetch_stock_data(ticker_symbol: str, period: str = "5y") -> pd.DataFrame:
    """Fetch historical stock price data."""
    try:
        ticker = yf.Ticker(ticker_symbol)
        df = ticker.history(period=period)
        if df.empty:
            print(f"yfinance returned empty for {ticker_symbol}, using mock data.")
            return generate_mock_data(ticker_symbol)
        return df
    except Exception as e:
        print(f"yfinance error for {ticker_symbol}: {e}, using mock data.")
        return generate_mock_data(ticker_symbol)

def fetch_stock_info(ticker_symbol: str) -> Dict[str, Any]:
    """Fetch fundamental data and info."""
    try:
        ticker = yf.Ticker(ticker_symbol)
        info = ticker.info
        if not info or len(info) <= 2:
            raise ValueError("No info found")
            
        return {
            "revenue_growth": info.get("revenueGrowth", "N/A"),
            "profit_growth": info.get("earningsGrowth", "N/A"),
            "debt": info.get("totalDebt", "N/A"),
            "roe": info.get("returnOnEquity", "N/A"),
            "roce": info.get("returnOnAssets", "N/A"),
            "pe_ratio": info.get("trailingPE", "N/A"),
            "industry_pe": info.get("forwardPE", "N/A"),
            "promoter_holding": info.get("heldPercentInsiders", "N/A"),
            "industry": info.get("industry", "N/A"),
            "sector": info.get("sector", "N/A"),
            # Market Snapshot
            "current_price": info.get("currentPrice") or info.get("regularMarketPrice", "N/A"),
            "prev_close": info.get("previousClose", "N/A"),
            "open": info.get("open", "N/A"),
            "day_low": info.get("dayLow", "N/A"),
            "day_high": info.get("dayHigh", "N/A"),
            "week_52_low": info.get("fiftyTwoWeekLow", "N/A"),
            "week_52_high": info.get("fiftyTwoWeekHigh", "N/A"),
            "volume": info.get("volume", "N/A"),
            "market_cap": info.get("marketCap", "N/A"),
            "target_price": info.get("targetMeanPrice", "N/A"),
            "eps": info.get("trailingEps", "N/A"),
            "exchange": info.get("exchange", "N/A"),
            "currency": info.get("currency", "USD"),
            "after_hours_price": info.get("postMarketPrice", "N/A"),
            "company_summary": info.get("longBusinessSummary", "No summary available.")[:500] if info.get("longBusinessSummary") else "N/A",
        }
    except Exception as e:
        print(f"Info fetch failed: {e}. Using fallback.")
        return {
            "revenue_growth": "N/A", "profit_growth": "N/A", "debt": "N/A",
            "roe": "N/A", "roce": "N/A", "pe_ratio": "N/A",
            "industry_pe": "N/A", "promoter_holding": "N/A",
            "industry": "N/A", "sector": "N/A",
            "current_price": "N/A", "prev_close": "N/A", "open": "N/A",
            "day_low": "N/A", "day_high": "N/A", "week_52_low": "N/A",
            "week_52_high": "N/A", "volume": "N/A", "market_cap": "N/A",
            "target_price": "N/A", "eps": "N/A", "exchange": "N/A",
            "currency": "USD", "after_hours_price": "N/A",
            "company_summary": "N/A",
        }

def fetch_stock_news(ticker_symbol: str) -> str:
    """Fetch latest news summary using NewsData API."""
    if not settings.NEWS_API_KEY:
        return "News API key not configured."
        
    # Extract company name from ticker for better search if possible, but ticker works sometimes.
    # For better results with NewsData, searching the ticker symbol is a good start.
    query = ticker_symbol.replace(".NS", "").replace(".BO", "")
    
    url = f"https://newsdata.io/api/1/latest?apikey={settings.NEWS_API_KEY}&q={query}&language=en"
    
    try:
        response = httpx.get(url, timeout=10.0)
        response.raise_for_status()
        data = response.json()
        
        results = data.get("results", [])
        if not results:
            return f"No recent news found for {query}."
            
        headlines = [item.get('title', '') for item in results[:5] if item.get('title')]
        return ". ".join(headlines)
    except Exception as e:
        return f"Failed to fetch news: {str(e)}"
