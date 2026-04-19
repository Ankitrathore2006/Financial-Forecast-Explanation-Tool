import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from typing import Tuple

def train_and_predict(df: pd.DataFrame) -> Tuple[str, float]:
    """
    Train a basic ML model to predict if the price will go up or down.
    Returns (prediction, confidence).
    """
    # Create target: 1 if close price goes up in the next 20 days (approx 1 month), else 0
    df['Target'] = (df['Close'].shift(-20) > df['Close']).astype(int)
    
    # Drop rows with NaN (from shifting and indicators)
    df_clean = df.dropna()
    
    if len(df_clean) < 100:
        return "Not enough data", 0.0
        
    features = ['rsi', 'macd', 'macd_signal', 'macd_diff', 'sma_50', 'sma_200', 'volume_sma_20']
    X = df_clean[features]
    y = df_clean['Target']
    
    # We will use all but the last 20 days for training
    # And the very last row for prediction
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Predict on the latest data point (which wasn't shifted into Target properly yet)
    # Actually, we should predict on df.iloc[-1]
    latest_features = df.iloc[-1][features].values.reshape(1, -1)
    
    # Predict proba
    probs = model.predict_proba(latest_features)[0]
    
    if probs[1] > probs[0]:
        prediction = "UP"
        confidence = probs[1] * 100
    else:
        prediction = "DOWN"
        confidence = probs[0] * 100
        
    return prediction, confidence
