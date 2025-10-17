import os
import json
from dotenv import load_dotenv
from levels import get_all_levels

# Load .env if present; only set dummy if nothing provided
load_dotenv()
if not os.getenv("GEMINI_API_KEY"):
    os.environ.setdefault("GEMINI_API_KEY", "__DUMMY__")

from app import app  # noqa: E402


def pretty(obj):
    try:
        return json.dumps(obj, indent=2, ensure_ascii=False)
    except Exception:
        return str(obj)


client = app.test_client()

print("\n== GET /health ==")
r = client.get("/health")
print(r.status_code)
print(pretty(r.get_json()))

print("\n== GET /api/models (to view resolved model) ==")
r = client.get("/api/models")
print(r.status_code)
data = r.get_json()
print(pretty({"resolved_model": data.get("resolved_model"), "models_count": len(data.get("models", []))}))

print("\n== Listing all levels (ids + titles) ==")
levels = get_all_levels()
print(len(levels), "levels found")
for lv in levels:
    print(f" - {lv['id']}: {lv['title']}")

print("\n== Q&A evaluation run across all challenges ==")

# Strong test prompts per challenge, embodying the rubric best practices
TEST_PROMPTS = {
    "roman_empire_facts": "Act as a concise historian. Return exactly five facts in a two-column Markdown table with headers 'Fact #' and 'Detail'. Each detail must be one concise sentence. No intro or outro text—only the table.",
    "supply_and_demand": "Act as a friendly tutor for a 15-year-old. Explain supply and demand using a fast-food restaurant analogy in exactly three short paragraphs: (1) core idea, (2) supply example, (3) demand example. Avoid jargon.",
    "energy_saving_three": "Provide exactly three ways to save energy at home as a numbered list (1-3). Each item must be a single sentence under 20 words. Do not include greetings or conclusions.",
    "la_to_ny_best_travel": "Identify the most cost-effective travel option from Los Angeles to New York for 2 adults within 5 days total travel time. Provide a 3-row Markdown table: Option, Est. Cost (USD), Time (hrs). End with one-sentence recommendation.",
    "cookie_recipe_ingredients": "Return a JSON array of objects for a basic chocolate chip cookie recipe ingredients. Each object must have fields: ingredientName, quantity, unit. No extra text.",
    "car_arrival_time_210_miles": "Show your work step-by-step: (1) compute total hours at 60 mph for 210 miles, (2) convert to hours/minutes, (3) add to 10:00 AM, then state final arrival time.",
    "tsla_stock_price_now": "Use the search tool to find TSLA’s most recent closing price. Respond: 'TSLA’s last closing price was $[PRICE] on [DATE].' Include the source URL.",
    "short_history_of_coffee": "Act as a sarcastic barista. In exactly three paragraphs, cover only the introduction of coffee to Europe and the rise of coffee houses. No modern coffee culture.",
    "email_week_off_boss": "You are a professional HR consultant. Draft an email template requesting one week off. Use placeholders [START_DATE], [END_DATE], [REASON]. Output only the email body. No filler outside.",
    "solar_vs_wind_benefits": "Compare solar vs wind for residential installation in a cloudy climate. Output a Markdown table with columns: Factor, Solar Power, Wind Power, Conclusion/Score (1-10).",
}

for lv in levels:
    level_id = lv["id"]
    prompt = TEST_PROMPTS.get(level_id, f"Provide a concise and well-structured response to: {lv['title']}")
    print(f"\n--- Evaluating: {level_id} — {lv['title']} ---")
    r = client.post("/api/evaluate", json={"level_id": level_id, "user_prompt": prompt})
    print("Status:", r.status_code)
    print(pretty(r.get_json()))
