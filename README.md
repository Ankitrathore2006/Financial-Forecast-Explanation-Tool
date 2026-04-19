# Financial Forecast Explanation Tool

A full-stack AI application that predicts stock movements (UP/DOWN) for the next month and provides a simple, beginner-friendly explanation of why, powered by Machine Learning and LLMs.

## Features
- **Stock Data Fetching**: Retrieves historical and fundamental data using Yahoo Finance.
- **News Sentiment**: Fetches the latest related news via NewsData.io.
- **Technical Indicators**: Calculates RSI, MACD, and Moving Averages.
- **Machine Learning**: Uses a Random Forest Classifier to predict the trend.
- **AI Explanations**: Uses OpenRouter (LLM) to generate a structured, easy-to-read explanation.
- **Beautiful UI**: Modern, glassmorphic React frontend with Chart.js visualizations.

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

## Example Usage
1. Open the frontend URL.
2. Enter a valid stock ticker symbol (e.g., `AAPL` for Apple, `RELIANCE.NS` for Reliance Industries).
3. Click "Analyze" and view the predictions and AI-generated report.
