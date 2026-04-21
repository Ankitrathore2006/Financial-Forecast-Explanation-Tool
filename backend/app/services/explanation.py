import httpx
import asyncio
from app.config.settings import settings

async def generate_explanation(
    stock_name: str,
    prediction: str,
    confidence: float,
    indicators: dict,
    info: dict,
    news: str,
    returns: dict,
    user_query: str = "",
    timeframe: str = "1mo"
) -> str:
    """Generate the structured explanation using the advanced AI financial analyst prompt."""

    # Build price change string from available data
    current_price = info.get('current_price', 'N/A')
    prev_close = info.get('prev_close', 'N/A')
    price_change = "N/A"
    if current_price != 'N/A' and prev_close != 'N/A':
        try:
            change = float(current_price) - float(prev_close)
            pct = (change / float(prev_close)) * 100
            price_change = f"{'+' if change >= 0 else ''}{change:.2f} ({'+' if pct >= 0 else ''}{pct:.2f}%)"
        except Exception:
            pass

    prompt = f"""
You are an advanced AI financial analyst with natural language understanding capabilities.

Your job is to analyze the stock below using structured, data-driven reasoning and provide a clear, unbiased, professional response.

---

## 🧠 QUERY INTERPRETATION

User's Original Query: "{user_query or stock_name}"
- Stock Identified: {stock_name}
- Timeframe Extracted: {timeframe}
- ML Model Verdict: {prediction} with {confidence:.2f}% confidence

---

## 📥 INPUT DATA

Stock: {stock_name}

Market Data:
- Current Price: {current_price} {info.get('currency', 'USD')}
- Price Change: {price_change}
- After Hours Price: {info.get('after_hours_price', 'N/A')}
- Exchange: {info.get('exchange', 'N/A')}
- Currency: {info.get('currency', 'USD')}

Key Stats:
- Previous Close: {prev_close}
- Open: {info.get('open', 'N/A')}
- Day Range: {info.get('day_low', 'N/A')} – {info.get('day_high', 'N/A')}
- 52 Week Range: {info.get('week_52_low', 'N/A')} – {info.get('week_52_high', 'N/A')}
- Volume: {info.get('volume', 'N/A')}
- Market Cap: {info.get('market_cap', 'N/A')}
- PE Ratio: {info.get('pe_ratio', 'N/A')}
- Forward PE: {info.get('industry_pe', 'N/A')}
- EPS: {info.get('eps', 'N/A')}
- 1Y Target Estimate: {info.get('target_price', 'N/A')}

Company Info:
{info.get('company_summary', 'N/A')}

Recent News:
{news}

Technical Indicators:
- RSI: {indicators.get('rsi', 'N/A')}
- MACD: {indicators.get('macd', 'N/A')}
- Moving Average Trend: {indicators.get('ma_trend', 'N/A')}
- Volume Trend: {indicators.get('volume_trend', 'N/A')}

Fundamentals:
- Revenue Growth: {info.get('revenue_growth', 'N/A')}
- Profit Growth: {info.get('profit_growth', 'N/A')}
- Total Debt: {info.get('debt', 'N/A')}
- ROE: {info.get('roe', 'N/A')}
- ROCE (ROA): {info.get('roce', 'N/A')}
- Insider/Promoter Holding: {info.get('promoter_holding', 'N/A')}
- Industry: {info.get('industry', 'N/A')}
- Sector: {info.get('sector', 'N/A')}

Past Returns:
- 1Y: {returns.get('return_1y', 'N/A')}
- 3Y: {returns.get('return_3y', 'N/A')}
- 5Y: {returns.get('return_5y', 'N/A')}

---

## 📊 OUTPUT INSTRUCTIONS

Generate a high-fidelity intelligence report.

STRICTLY use this header format for each section: ## [icon_name] [Title]
This lets the UI parse and display each section as a separate card.

The sections MUST be:

## psychology Overall Verdict
- **Short Term (1-3 months):** Outlook with reasoning.
- **Medium Term (3-12 months):** Outlook with reasoning.
- **Long Term (1-3 years):** Outlook with reasoning.
- **Classification:** Bullish / Bearish / Sideways
- **Confidence:** {confidence:.2f}% (ML Model)

## attach_money Market Snapshot
- **Current Price:** {current_price} {info.get('currency', 'USD')}
- **Price Change:** {price_change}
- **After Hours:** {info.get('after_hours_price', 'N/A')}
- **Market Cap:** {info.get('market_cap', 'N/A')}
- **PE Ratio:** {info.get('pe_ratio', 'N/A')} (Forward: {info.get('industry_pe', 'N/A')})
- **1Y Target Estimate:** {info.get('target_price', 'N/A')}
- **52W Range:** {info.get('week_52_low', 'N/A')} – {info.get('week_52_high', 'N/A')}

## newspaper Latest News & Impact
- **Key News:** Summarize the most impactful news from the provided headlines.
- **Impact:** How does this news directly affect the stock price?
- **Reasoning:** Explain the market psychology behind the news.

## analytics Technical Analysis
- **Trend:** Current trend direction based on moving averages.
- **RSI Insight:** Is the stock overbought, oversold, or neutral?
- **MACD Signal:** Bullish crossover, bearish crossover, or neutral?
- **Volume Behavior:** Is volume confirming or contradicting the trend?
- **Support Zone:** Key support level to watch.
- **Resistance Zone:** Key resistance level to watch.
- **Entry Zone:** Recommended price entry range.
- **Exit Zone:** Recommended price exit/target range.

## account_balance Fundamental Analysis
- **Revenue Growth:** Assessment with trend.
- **Profit Growth:** Assessment with trend.
- **Debt Situation:** Is the debt manageable?
- **ROE/ROCE:** Efficiency of capital deployment.
- **Valuation Insight:** Is the PE ratio justified vs. industry/sector?
- **Insider Holding:** What does the holding percentage signal?

## bar_chart Past Performance
- **1Y Return:** {returns.get('return_1y', 'N/A')} – assessment.
- **3Y Return:** {returns.get('return_3y', 'N/A')} – assessment.
- **5Y Return:** {returns.get('return_5y', 'N/A')} – assessment.
- **Consistency:** Is the performance consistent or volatile?

## warning Risks
- **Company Risk:** Internal risks (debt, management, competition).
- **Sector Risk:** Industry-specific risks or headwinds.
- **Market Risk:** Macro risks (interest rates, geopolitics, recession signals).

## auto_awesome Final Insight
- **Simple Explanation:** Explain in 2-3 sentences why someone should or shouldn't invest — as if talking to a beginner.
- **Final Recommendation:** [Avoid / Watch / Opportunity]
- **Best Condition to Invest:** Describe the ideal scenario/trigger to consider entry.

---

## 🎯 OUTPUT STYLE RULES:
- Each bullet point MUST start with a **bolded topic label** (e.g., - **RSI Insight:** ...).
- Leave a blank line between each bullet point for breathing room.
- Use simple, clear language — avoid excessive jargon.
- Be direct: give a verdict, not just a description.
- NEVER hallucinate data that wasn't provided — mark it as "N/A" or "Insufficient data".
- DO NOT add bold or markdown within the ## section headers themselves.
"""

    # ── Helper: call Gemini with retries ──────────────────────────────────────
    async def _call_gemini(p: str) -> str:
        """Call Gemini API with up to 3 retries on 503/429 errors."""
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{settings.MODEL_NAME}:generateContent?key={settings.GEMINI_API_KEY}"
        )
        hdrs = {"Content-Type": "application/json"}
        body = {"contents": [{"parts": [{"text": p}]}]}

        for attempt in range(3):
            async with httpx.AsyncClient() as client:
                try:
                    resp = await client.post(url, headers=hdrs, json=body, timeout=90.0)
                    if resp.status_code in (503, 429, 500):
                        wait = 2 ** attempt  # 1s, 2s, 4s
                        print(f"[Gemini] {resp.status_code} on attempt {attempt+1}, retrying in {wait}s…")
                        await asyncio.sleep(wait)
                        continue
                    resp.raise_for_status()
                    data = resp.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"]
                except httpx.TimeoutException:
                    print(f"[Gemini] Timeout on attempt {attempt+1}")
                    await asyncio.sleep(2 ** attempt)
                except Exception as e:
                    print(f"[Gemini] Error on attempt {attempt+1}: {e}")
                    await asyncio.sleep(1)
        raise RuntimeError("Gemini API unavailable after 3 retries")

    # ── Helper: call OpenRouter with retries ───────────────────────────────────
    async def _call_openrouter(p: str) -> str:
        """Call OpenRouter API with up to 3 retries."""
        hdrs = {
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        }
        body = {"model": settings.MODEL_NAME, "messages": [{"role": "user", "content": p}]}

        for attempt in range(3):
            async with httpx.AsyncClient() as client:
                try:
                    resp = await client.post(
                        "https://openrouter.ai/api/v1/chat/completions",
                        headers=hdrs, json=body, timeout=90.0
                    )
                    if resp.status_code in (503, 429, 500):
                        wait = 2 ** attempt
                        print(f"[OpenRouter] {resp.status_code} on attempt {attempt+1}, retrying in {wait}s…")
                        await asyncio.sleep(wait)
                        continue
                    resp.raise_for_status()
                    data = resp.json()
                    return data["choices"][0]["message"]["content"]
                except httpx.TimeoutException:
                    print(f"[OpenRouter] Timeout on attempt {attempt+1}")
                    await asyncio.sleep(2 ** attempt)
                except Exception as e:
                    print(f"[OpenRouter] Error on attempt {attempt+1}: {e}")
                    await asyncio.sleep(1)
        raise RuntimeError("OpenRouter API unavailable after 3 retries")

    # ── Local structured fallback ──────────────────────────────────────────────
    def _local_fallback() -> str:
        """Return a structured report from available data when all APIs fail."""
        cp = info.get('current_price', 'N/A')
        mc = info.get('market_cap', 'N/A')
        pe = info.get('pe_ratio', 'N/A')
        tp = info.get('target_price', 'N/A')
        rsi_val = indicators.get('rsi', 'N/A')
        ma = indicators.get('ma_trend', 'N/A')
        vol = indicators.get('volume_trend', 'N/A')
        r1 = returns.get('return_1y', 'N/A')
        r3 = returns.get('return_3y', 'N/A')
        r5 = returns.get('return_5y', 'N/A')
        direction = "bullish" if prediction == "UP" else "bearish"

        return f"""## psychology Overall Verdict

- **Classification:** {prediction} ({direction.capitalize()})

- **Confidence:** {confidence:.2f}% (ML Model)

- **Short Term (1–3 months):** The ML model predicts a {prediction} direction with {confidence:.2f}% confidence. Trend is currently {ma}.

- **Note:** The AI narrative engine is temporarily unavailable (API 503). This is a data-only report generated from live market indicators.

## attach_money Market Snapshot

- **Current Price:** {cp} {info.get('currency', 'USD')}

- **Price Change:** {price_change}

- **Market Cap:** {mc}

- **PE Ratio:** {pe}

- **1Y Target Estimate:** {tp}

- **52W Range:** {info.get('week_52_low', 'N/A')} – {info.get('week_52_high', 'N/A')}

## analytics Technical Analysis

- **Trend:** {ma}

- **RSI Insight:** {rsi_val} {'— Overbought (>70), caution advised.' if isinstance(rsi_val, (int, float)) and float(rsi_val) > 70 else ('— Oversold (<30), potential bounce.' if isinstance(rsi_val, (int, float)) and float(rsi_val) < 30 else '— Neutral zone (30–70).')}

- **MACD Signal:** {indicators.get('macd', 'N/A')}

- **Volume Behavior:** {vol}

## bar_chart Past Performance

- **1Y Return:** {r1}

- **3Y Return:** {r3}

- **5Y Return:** {r5}

## warning Risks

- **API Risk:** The AI narrative engine returned a 503 error (server overload). Retry in a few minutes for a full detailed report.

- **Market Risk:** Always cross-reference ML predictions with your own research before making investment decisions.

## auto_awesome Final Insight

- **Simple Explanation:** The ML model is {confidence:.1f}% confident the stock will go {prediction.lower()} over the next 20 trading days. The technical trend is {ma.lower()}.

- **Final Recommendation:** {'Opportunity — technicals and model align.' if (prediction == 'UP' and ma == 'Uptrend') else ('Avoid — bearish signals across model and technicals.' if (prediction == 'DOWN' and ma == 'Downtrend') else 'Watch — mixed signals, monitor closely.')}

- **Best Condition to Invest:** Wait for the full AI narrative report by retrying the analysis once the API recovers.
"""

    # ── Execution chain: Gemini → OpenRouter → Local fallback ─────────────────
    if settings.GEMINI_API_KEY:
        try:
            return await _call_gemini(prompt)
        except Exception as e:
            print(f"[Explanation] Gemini failed: {e}. Trying OpenRouter…")

    if settings.OPENROUTER_API_KEY:
        try:
            return await _call_openrouter(prompt)
        except Exception as e:
            print(f"[Explanation] OpenRouter also failed: {e}. Using local fallback.")

    # Both APIs failed — return structured local fallback
    return _local_fallback()
