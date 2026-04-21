"""
NLP Query Parser: Extracts stock ticker symbol and timeframe from natural language user queries.
Examples:
  "IBM stock price will increase in 6 months" -> ticker: IBM, timeframe: "6mo"
  "Should I buy Apple shares next month?"     -> ticker: AAPL, timeframe: "1mo"
  "Reliance NS performance next year"         -> ticker: RELIANCE.NS, timeframe: "1y"
"""
import re
from typing import Tuple

# Map of common company names / aliases -> yfinance ticker symbols
COMPANY_NAME_MAP = {
    # US Tech
    "apple": "AAPL", "aapl": "AAPL",
    "tesla": "TSLA", "tsla": "TSLA",
    "microsoft": "MSFT", "msft": "MSFT",
    "nvidia": "NVDA", "nvda": "NVDA",
    "amazon": "AMZN", "amzn": "AMZN",
    "google": "GOOGL", "alphabet": "GOOGL", "googl": "GOOGL",
    "meta": "META", "facebook": "META",
    "netflix": "NFLX", "nflx": "NFLX",
    "ibm": "IBM",
    "intel": "INTC", "intc": "INTC",
    "amd": "AMD", "advanced micro devices": "AMD",
    "qualcomm": "QCOM", "qcom": "QCOM",
    "oracle": "ORCL", "orcl": "ORCL",
    "salesforce": "CRM", "crm": "CRM",
    "adobe": "ADBE", "adbe": "ADBE",
    "paypal": "PYPL", "pypl": "PYPL",
    "twitter": "TWTR", "x corp": "TWTR",
    "uber": "UBER",
    "lyft": "LYFT",
    "spotify": "SPOT",
    "airbnb": "ABNB",
    "coinbase": "COIN",
    # US Finance
    "jpmorgan": "JPM", "jp morgan": "JPM", "jpm": "JPM",
    "goldman sachs": "GS", "goldman": "GS",
    "morgan stanley": "MS",
    "bank of america": "BAC", "bofa": "BAC",
    "berkshire": "BRK-B", "berkshire hathaway": "BRK-B",
    # US Other
    "walmart": "WMT", "wmt": "WMT",
    "disney": "DIS",
    "johnson": "JNJ", "j&j": "JNJ",
    "pfizer": "PFE",
    "exxon": "XOM",
    "chevron": "CVX",
    "coca cola": "KO", "coke": "KO",
    "pepsi": "PEP", "pepsico": "PEP",
    "mcdonalds": "MCD",
    "nike": "NKE",
    "boeing": "BA",
    "ford": "F",
    "general motors": "GM",
    # Indian
    "reliance": "RELIANCE.NS", "reliance industries": "RELIANCE.NS",
    "tcs": "TCS.NS", "tata consultancy": "TCS.NS",
    "infosys": "INFY.NS", "infy": "INFY.NS",
    "wipro": "WIPRO.NS",
    "hdfc": "HDFCBANK.NS", "hdfc bank": "HDFCBANK.NS",
    "icici": "ICICIBANK.NS", "icici bank": "ICICIBANK.NS",
    "sbi": "SBIN.NS", "state bank": "SBIN.NS",
    "tatamotors": "TATAMOTORS.NS", "tata motors": "TATAMOTORS.NS",
    "bajaj": "BAJFINANCE.NS", "bajaj finance": "BAJFINANCE.NS",
    "asian paints": "ASIANPAINT.NS",
    "hul": "HINDUNILVR.NS", "hindustan unilever": "HINDUNILVR.NS",
    "itc": "ITC.NS",
    "ongc": "ONGC.NS",
    "ntpc": "NTPC.NS",
    "maruti": "MARUTI.NS", "maruti suzuki": "MARUTI.NS",
    "sun pharma": "SUNPHARMA.NS",
    "dr reddy": "DRREDDY.NS",
    "larsen": "LT.NS", "l&t": "LT.NS", "larsen toubro": "LT.NS",
    "adani": "ADANIPORTS.NS", "adani ports": "ADANIPORTS.NS",
    "sensex": "^BSESN", "nifty": "^NSEI",
    # Crypto
    "bitcoin": "BTC-USD", "btc": "BTC-USD",
    "ethereum": "ETH-USD", "eth": "ETH-USD",
    "dogecoin": "DOGE-USD", "doge": "DOGE-USD",
}

# Timeframe pattern matching — ordered from most specific to least
TIMEFRAME_PATTERNS = [
    # "6 months", "6-month", "half year"
    (r"\b6\s*months?\b|\bhalf[\s-]?year\b", lambda m: "6mo"),
    # "3 months", "quarterly", "quarter"
    (r"\b3\s*months?\b|\bquarterly\b|\bquarter\b", lambda m: "3mo"),
    # "2 years", "3 years" etc
    (r"\b(\d+)\s*years?\b", lambda m: f"{m.group(1)}y"),
    # "next year", "1 year", "long term"
    (r"\bnext\s*year\b|\b1\s*year\b|\blong[\s-]?term\b|\bannually\b", lambda m: "1y"),
    # "N months" (any number)
    (r"\b(\d+)\s*months?\b", lambda m: f"{int(m.group(1))}mo"),
    # "next month", "1 month", "monthly"
    (r"\bnext\s*month\b|\b1\s*month\b|\bmonthly\b", lambda m: "1mo"),
    # "next week", "weekly", "short term"
    (r"\bnext\s*week\b|\bweekly\b|\bshort[\s-]?term\b", lambda m: "1wk"),
    # "today", "intraday", "daily"
    (r"\btoday\b|\bintraday\b|\bdaily\b", lambda m: "1d"),
]


def extract_ticker_from_query(query: str) -> Tuple[str, str]:
    """
    Parse a natural language query and return (ticker_symbol, timeframe).
    Falls back to the raw query if no match is found (user may have typed a ticker directly).
    """
    q = query.strip()
    q_lower = q.lower()

    # --- Extract timeframe ---
    timeframe = "1mo"  # default
    for pattern, converter in TIMEFRAME_PATTERNS:
        m = re.search(pattern, q_lower)
        if m:
            timeframe = converter(m)
            break

    # --- Try to extract ticker from known company names (longest match first) ---
    sorted_names = sorted(COMPANY_NAME_MAP.keys(), key=len, reverse=True)
    for name in sorted_names:
        if name in q_lower:
            return COMPANY_NAME_MAP[name], timeframe

    # --- Try to extract an uppercase ticker symbol (e.g. IBM, TSLA, RELIANCE.NS) ---
    # Match standalone ALL-CAPS words (2-10 chars), optionally with .NS / .BO suffix
    ticker_match = re.search(r"\b([A-Z]{2,10}(?:\.[A-Z]{2})?)\b", q)
    if ticker_match:
        candidate = ticker_match.group(1)
        # Ignore common English uppercase words that are not tickers
        skip_words = {"STOCK", "PRICE", "WILL", "INCREASE", "DECREASE", "IN", "THE",
                      "AT", "OF", "FOR", "AND", "OR", "NOT", "BUY", "SELL", "HOLD",
                      "NEXT", "YEAR", "MONTH", "WEEK", "IS", "IT", "TO", "UP", "DOWN"}
        if candidate not in skip_words:
            return candidate, timeframe

    # --- Last resort: return the raw query as-is (user typed a ticker directly) ---
    # Strip common filler words from the front/end to clean it up a bit
    cleaned = re.sub(
        r"\b(stock|shares?|price|will|should|i|buy|sell|analysis|for|the|in|next|about)\b",
        "", q_lower, flags=re.IGNORECASE
    ).strip().upper()
    return (cleaned if cleaned else q.upper()), timeframe
