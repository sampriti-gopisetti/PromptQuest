# Prompt Quest Backend (Flask + Gemini)

This is a minimal Flask API that evaluates player prompts for the Prompt Quest game using Google's Gemini model.

## Endpoints

- `GET /health` — Basic health check.
- `GET /api/levels/<level_id>` — Fetch level details using the provided `levels.py` module.
- `POST /api/evaluate` — Evaluate a player's prompt against a level's challenge goal.

## Request/Response

`POST /api/evaluate`

Body (JSON):
```
{
  "level_id": "roman_empire_facts",
  "user_prompt": "Act as a concise historian and respond with a 5-row markdown table of facts..."
}
```

Response (JSON):
```
{
  "score": 0-100,
  "feedback": "..."
}
```

## Setup

1. Create a Python virtual environment (optional but recommended)
2. Install dependencies
3. Configure environment variables
4. Run the server

### Windows (cmd.exe)

```
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Edit .env and set GEMINI_API_KEY
python app.py
```

Server runs on http://localhost:5000 by default.

## Notes

- Requires a teammate-provided `levels.py` with a function `get_level_details(level_id: str) -> dict | None`.
- The Gemini call uses strict JSON output via `response_mime_type=application/json` and validates the schema (`score`, `feedback`).
- For production, consider adding request body size limits, rate limiting, and structured logging.

## Git: keep secrets out and push safely

This repo includes a `.gitignore` that excludes your virtual env, caches, and `.env` files. To commit and push your changes:

```
git add .
git commit -m "Prompt Quest backend: Flask API + Gemini judge + levels + smoketest"
git branch -M main
git remote add origin <YOUR_GITHUB_REMOTE_URL>
git push -u origin main
```

Make sure you never commit your real `.env`; use `.env.example` for sharing required variables.
