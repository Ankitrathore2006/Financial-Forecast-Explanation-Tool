# Explainable AI: Financial Forecast & Intelligence Engine

Explainable AI is a premium, institutional-grade financial intelligence platform that doesn't just predict the future—it explains it. By combining advanced Machine Learning (Random Forest) with state-of-the-art LLMs (Gemini/OpenRouter), it delivers deep, data-driven insights into stock movements with professional-grade clarity.

---
## Features
- **Stock Data Fetching**: Retrieves historical and fundamental data using Yahoo Finance.
- **News Sentiment**: Fetches the latest related news via NewsData.io.
- **Technical Indicators**: Calculates RSI, MACD, and Moving Averages.
- **Machine Learning**: Uses a Random Forest Classifier to predict the trend.
- **AI Explanations**: Uses OpenRouter (LLM) to generate a structured, easy-to-read explanation.
- **Beautiful UI**: Modern, glassmorphic React frontend with Chart.js visualizations.

### 🧠 Natural Language Intelligence (NLP)
- **Conversational Search**: No longer restricted to tickers. Ask questions like *"Will Tesla go up in 6 months?"* or *"Should I buy Apple shares next month?"*.
- **Automatic Entity Resolution**: The engine automatically maps company names to valid market tickers (e.g., Apple → `AAPL`, Reliance → `RELIANCE.NS`) and extracts the desired timeframe.

### 🎨 Premium Executive UI
- **Obsidian Dark Theme**: A high-fidelity, glassmorphic design system using sapphire and obsidian color palettes.
- **Bento-Grid Reports**: Intelligence reports are parsed into high-contrast, structured cards with distinct iconography for Technicals, Fundamentals, Risks, and Verdicts.
- **Dynamic Dashboard**: Live AI projection cards showing resolved tickers, original queries, and real-time price badges.
- **Persistent Ecosystem**: Built-in persistent Watchlist and Search History for quick access to previous analyses.

### 📊 Advanced Financial Pipeline
- **Deep Market Snapshots**: Ingests P/E ratios, 1Y Target Estimates, 52-Week ranges, EPS, and Company Summaries.
- **High-Availability AI**: Implemented **Exponential Backoff Retries** for API 503 errors and a **Graceful Local Fallback** that provides a data-driven report even when AI APIs are down.
- **Multi-API Redundancy**: Seamless failover between Google Gemini and OpenRouter.

### 🧪 Backtesting & Validation
- **Proven Accuracy**: Includes a `backtest.py` module that runs walk-forward validation on historical data.
- **Directional Precision**: The current model achieves a **~87% directional accuracy** across major US and Indian equities.

## Project Structure
- `backend/` - FastAPI Python application
- `frontend/` - React + Vite frontend

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env`:
   - Copy `.env.example` to `.env`
   - Add your `GEMINI_API_KEY` and `NEWS_API_KEY` (from newsdata.io).
5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The API will be available at http://localhost:8000*

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The UI will be available at http://localhost:5173*


---

## 📈 Model Performance Testing
To verify the ML model's accuracy on your local machine:
```bash
cd backend
venv/bin/python3 backtest.py
```
This will run a 50-step walk-forward test on tickers like TSLA, NVDA, and RELIANCE.NS, outputting a detailed precision report.

---

## Example Usage
1. Open the frontend URL.
2. Enter a valid stock ticker symbol (e.g., `AAPL` for Apple, `RELIANCE.NS` for Reliance Industries).
3. Click "Analyze" and view the predictions and AI-generated report.


## 🛡 Disclaimer
*Explainable AI provides data-driven forecasts for informational purposes only. It is not financial advice. Always perform your own due diligence before investing.*

© 2024 Explainable AI. Data-Driven Foresight.
