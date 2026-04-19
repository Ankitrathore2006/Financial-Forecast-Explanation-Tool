import React, { useState } from 'react';

const ForecastForm = ({ onAnalyze, isLoading }) => {
  const [stockName, setStockName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (stockName.trim()) {
      onAnalyze(stockName.trim());
    }
  };

  return (
    <form className="forecast-form glass-panel" onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor="stockName">Stock Symbol (e.g., RELIANCE.NS, AAPL)</label>
        <input
          type="text"
          id="stockName"
          value={stockName}
          onChange={(e) => setStockName(e.target.value)}
          placeholder="Enter stock symbol..."
          required
          autoComplete="off"
        />
      </div>
      <button type="submit" className="analyze-btn" disabled={isLoading || !stockName.trim()}>
        {isLoading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  );
};

export default ForecastForm;
