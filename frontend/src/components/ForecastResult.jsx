import React from 'react';
import ReactMarkdown from 'react-markdown';

const ForecastResult = ({ result }) => {
  if (!result) return null;

  const { prediction, confidence, explanation, indicators } = result;
  
  const isUp = prediction === 'UP';
  const predictionClass = isUp ? 'prediction-up' : 'prediction-down';

  return (
    <div className="glass-panel">
      <div className="prediction-card">
        <h2 style={{ color: 'var(--text-secondary)' }}>Model Prediction (1 Month)</h2>
        <div className={`prediction-value ${predictionClass}`}>
          {prediction}
        </div>
        <div className="confidence">
          Confidence: <strong>{confidence}%</strong>
        </div>
      </div>

      {indicators && (
        <div className="metrics-grid" style={{ marginBottom: '2rem' }}>
          <div className="metric-box">
            <div className="metric-label">RSI</div>
            <div className="metric-value">{indicators.rsi}</div>
          </div>
          <div className="metric-box">
            <div className="metric-label">MACD</div>
            <div className="metric-value">{indicators.macd}</div>
          </div>
          <div className="metric-box">
            <div className="metric-label">Trend</div>
            <div className="metric-value">{indicators.ma_trend}</div>
          </div>
          <div className="metric-box">
            <div className="metric-label">Volume</div>
            <div className="metric-value">{indicators.volume_trend}</div>
          </div>
        </div>
      )}

      <div className="explanation-content">
        <ReactMarkdown>{explanation}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ForecastResult;
