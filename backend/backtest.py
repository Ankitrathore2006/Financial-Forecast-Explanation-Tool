"""
Backtesting Script — Explainable ML Model Accuracy Evaluator
================================================================
Tests the Random Forest model's directional accuracy (UP/DOWN) against
actual historical price movements across multiple stocks and horizons.

Usage:
    cd /path/to/backend
    python backtest.py

Output:
    - Per-stock accuracy table
    - Overall accuracy summary
    - Confusion matrix per stock
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import pandas as pd
import numpy as np
import yfinance as yf
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from datetime import datetime

# ── Configuration ──────────────────────────────────────────────────────────────

TEST_STOCKS = [
    "TSLA", "AAPL", "MSFT", "NVDA", "GOOGL",
    "IBM", "AMZN", "META",
    "RELIANCE.NS", "TCS.NS", "INFY.NS",
]

PREDICTION_HORIZON_DAYS = 20   # ~1 month (matches the model's shift(-20))
WALK_FORWARD_STEPS      = 50   # How many time steps to walk-forward test
TRAIN_MIN_ROWS          = 300  # Minimum rows needed to train

FEATURES = ['rsi', 'macd', 'macd_signal', 'macd_diff', 'sma_50', 'sma_200', 'volume_sma_20']

# ── Feature Engineering (mirrors app/services/feature_engineering.py) ─────────

def add_indicators(df: pd.DataFrame) -> pd.DataFrame:
    try:
        import ta
        df = df.copy()
        df['rsi']           = ta.momentum.RSIIndicator(close=df['Close'], window=14).rsi()
        macd                = ta.trend.MACD(close=df['Close'])
        df['macd']          = macd.macd()
        df['macd_signal']   = macd.macd_signal()
        df['macd_diff']     = macd.macd_diff()
        df['sma_50']        = ta.trend.SMAIndicator(close=df['Close'], window=50).sma_indicator()
        df['sma_200']       = ta.trend.SMAIndicator(close=df['Close'], window=200).sma_indicator()
        df['volume_sma_20'] = df['Volume'].rolling(window=20).mean()
        return df.dropna()
    except ImportError:
        print("❌  'ta' library not installed. Run: pip install ta")
        sys.exit(1)

# ── Walk-Forward Backtester ────────────────────────────────────────────────────

def backtest_stock(ticker: str) -> dict:
    """
    Walk-forward backtest:
    - For each step i in the last WALK_FORWARD_STEPS windows:
        • Train on data[:i]
        • Predict UP/DOWN for data[i]
        • Check actual outcome 20 trading days later
    Returns a dict with accuracy metrics.
    """
    print(f"\n  📊  {ticker}", end="", flush=True)

    # Download 5 years of data
    try:
        df_raw = yf.download(ticker, period="5y", progress=False, auto_adjust=True)
        if df_raw.empty or len(df_raw) < TRAIN_MIN_ROWS + WALK_FORWARD_STEPS + PREDICTION_HORIZON_DAYS:
            return {"ticker": ticker, "status": "SKIPPED", "reason": "Insufficient data"}
    except Exception as e:
        return {"ticker": ticker, "status": "ERROR", "reason": str(e)}

    # Flatten MultiIndex columns if present
    if isinstance(df_raw.columns, pd.MultiIndex):
        df_raw.columns = df_raw.columns.get_level_values(0)

    df_feat = add_indicators(df_raw)

    # Build Target: 1 if price goes UP in next PREDICTION_HORIZON_DAYS trading days
    df_feat['Target'] = (df_feat['Close'].shift(-PREDICTION_HORIZON_DAYS) > df_feat['Close']).astype(int)
    df_feat = df_feat.dropna()

    predictions = []
    actuals     = []

    # Walk-forward: start testing from TRAIN_MIN_ROWS rows in
    start_idx = TRAIN_MIN_ROWS
    end_idx   = len(df_feat) - PREDICTION_HORIZON_DAYS  # can't know future past this

    test_indices = range(max(start_idx, end_idx - WALK_FORWARD_STEPS), end_idx)

    for i in test_indices:
        train_slice = df_feat.iloc[:i]
        test_row    = df_feat.iloc[i]

        if len(train_slice) < TRAIN_MIN_ROWS:
            continue

        X_train = train_slice[FEATURES]
        y_train = train_slice['Target']

        # Skip if only one class in training data
        if y_train.nunique() < 2:
            continue

        model = RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1)
        model.fit(X_train, y_train)

        X_pred = test_row[FEATURES].values.reshape(1, -1)
        probs  = model.predict_proba(X_pred)[0]
        pred   = 1 if probs[1] > probs[0] else 0

        actual = int(test_row['Target'])
        predictions.append(pred)
        actuals.append(actual)

        print(".", end="", flush=True)

    if not predictions:
        return {"ticker": ticker, "status": "SKIPPED", "reason": "No predictions made"}

    acc = accuracy_score(actuals, predictions) * 100
    cm  = confusion_matrix(actuals, predictions, labels=[0, 1])
    report = classification_report(actuals, predictions, target_names=['DOWN','UP'], zero_division=0)

    return {
        "ticker":      ticker,
        "status":      "OK",
        "samples":     len(predictions),
        "accuracy":    round(acc, 1),
        "up_correct":  int(cm[1][1]) if cm.shape == (2,2) else 0,
        "up_total":    int(cm[1].sum()) if cm.shape == (2,2) else 0,
        "dn_correct":  int(cm[0][0]) if cm.shape == (2,2) else 0,
        "dn_total":    int(cm[0].sum()) if cm.shape == (2,2) else 0,
        "report":      report,
    }

# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    print("=" * 70)
    print("  🔮  Explainable — ML Prediction Accuracy Backtester")
    print(f"  📅  Horizon: {PREDICTION_HORIZON_DAYS} trading days (~1 month)")
    print(f"  🔁  Walk-forward steps per stock: {WALK_FORWARD_STEPS}")
    print(f"  📈  Stocks: {', '.join(TEST_STOCKS)}")
    print("=" * 70)

    results = []
    for ticker in TEST_STOCKS:
        r = backtest_stock(ticker)
        results.append(r)

    # ── Summary Table ──────────────────────────────────────────────────────────
    print("\n\n" + "=" * 70)
    print("  📋  RESULTS SUMMARY")
    print("=" * 70)
    print(f"  {'Ticker':<15} {'Status':<10} {'Accuracy':<12} {'Samples':<10} {'UP Acc':<10} {'DN Acc':<10}")
    print("  " + "-" * 65)

    ok_results = []
    for r in results:
        if r['status'] == 'OK':
            up_acc = f"{r['up_correct']}/{r['up_total']}" if r['up_total'] > 0 else "N/A"
            dn_acc = f"{r['dn_correct']}/{r['dn_total']}" if r['dn_total'] > 0 else "N/A"
            grade  = "✅" if r['accuracy'] >= 55 else ("⚠️" if r['accuracy'] >= 45 else "❌")
            print(f"  {r['ticker']:<15} {grade + ' OK':<10} {str(r['accuracy'])+'%':<12} {r['samples']:<10} {up_acc:<10} {dn_acc:<10}")
            ok_results.append(r)
        else:
            print(f"  {r['ticker']:<15} {'⏭️ SKIP':<10} {'N/A':<12} {'—':<10} {'—':<10} {'—':<10}  ({r.get('reason','')})")

    if ok_results:
        avg_acc = np.mean([r['accuracy'] for r in ok_results])
        total_samples = sum(r['samples'] for r in ok_results)
        total_correct = sum(
            r['up_correct'] + r['dn_correct'] for r in ok_results
        )

        print("  " + "-" * 65)
        print(f"  {'OVERALL':<15} {'':10} {str(round(avg_acc,1))+'%':<12} {total_samples:<10}")
        print()
        print(f"  🎯  Average Directional Accuracy : {avg_acc:.1f}%")
        print(f"  📊  Total Walk-Forward Samples   : {total_samples}")
        print(f"  ✅  Total Correct Predictions    : {total_correct}")
        print()

        # Interpretation
        if avg_acc >= 60:
            verdict = "🟢 STRONG — Model shows meaningful predictive power above random chance (50%)"
        elif avg_acc >= 53:
            verdict = "🟡 MODERATE — Model slightly beats random; useful as a directional signal"
        elif avg_acc >= 47:
            verdict = "🟠 WEAK — Near random (50%); rely more on AI narrative than ML direction"
        else:
            verdict = "🔴 POOR — Below random chance; model may be overfit or data too noisy"

        print(f"  Verdict: {verdict}")

    # ── Detailed Reports ───────────────────────────────────────────────────────
    print("\n\n" + "=" * 70)
    print("  📈  DETAILED CLASSIFICATION REPORTS")
    print("=" * 70)
    for r in ok_results:
        print(f"\n  {r['ticker']} — Accuracy: {r['accuracy']}%")
        print("  " + "-" * 50)
        for line in r['report'].splitlines():
            print("  " + line)

    print("\n" + "=" * 70)
    print(f"  ⏱  Backtest completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)

if __name__ == "__main__":
    main()
