import pandas as pd
import ta
import numpy as np

def add_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """Add RSI, MACD, Moving Averages to the DataFrame."""
    # Ensure datetime index is clean
    if not isinstance(df.index, pd.DatetimeIndex):
        df.index = pd.to_datetime(df.index)
        
    # RSI
    df['rsi'] = ta.momentum.RSIIndicator(close=df['Close'], window=14).rsi()
    
    # MACD
    macd = ta.trend.MACD(close=df['Close'])
    df['macd'] = macd.macd()
    df['macd_signal'] = macd.macd_signal()
    df['macd_diff'] = macd.macd_diff()
    
    # Moving Averages
    df['sma_50'] = ta.trend.SMAIndicator(close=df['Close'], window=50).sma_indicator()
    df['sma_200'] = ta.trend.SMAIndicator(close=df['Close'], window=200).sma_indicator()
    
    # Volume Trend (simple moving average of volume)
    df['volume_sma_20'] = df['Volume'].rolling(window=20).mean()
    
    df = df.dropna()
    return df

def get_latest_indicators(df: pd.DataFrame) -> dict:
    """Extract the most recent indicators for the prompt."""
    if df.empty:
        return {}
    latest = df.iloc[-1]
    
    # Determine trends
    ma_trend = "Uptrend" if latest['sma_50'] > latest['sma_200'] else "Downtrend"
    volume_trend = "Increasing" if latest['Volume'] > latest['volume_sma_20'] else "Decreasing"
    
    return {
        "rsi": round(latest['rsi'], 2),
        "macd": round(latest['macd'], 2),
        "ma_trend": ma_trend,
        "volume_trend": volume_trend,
        "current_price": round(latest['Close'], 2)
    }

def calculate_returns(df: pd.DataFrame) -> dict:
    """Calculate 1y, 3y, 5y returns if data is available."""
    current_price = df['Close'].iloc[-1]
    returns = {}
    
    # Assuming ~252 trading days per year
    for years in [1, 3, 5]:
        days = years * 252
        if len(df) > days:
            past_price = df['Close'].iloc[-days]
            pct_return = ((current_price - past_price) / past_price) * 100
            returns[f"return_{years}y"] = f"{pct_return:.2f}%"
        else:
            returns[f"return_{years}y"] = "N/A"
            
    return returns
