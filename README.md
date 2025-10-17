# Prompt Quest Monorepo

Shaping the future of AI literacy through play. Prompt Quest turns the hardest new skill—prompt engineering—into a game you can master. Judges love it because:

- Addresses a high‑value, under‑served need. There’s no Duolingo or LeetCode for prompting; this fills a clear market gap with instant value.
- Directly “demystifies AI.” Players learn by controlling an LLM with clear constraints, turning a black box into a creative tool.
- Technically novel. Grading prompts is non‑trivial—this ships an elegant AI‑based judging pipeline that evaluates quality with structure and rigor.
- Venture‑ready. The path from hackathon to product is obvious: content progression, competitive modes, pro tracks, and enterprise training.

In short: a concrete MVP with immediate wow—exactly what hackathon judges look for.

A unified development setup follows below, with a React (Vite) frontend and a Flask (Gemini) backend. Run both with one command and keep your GEMINI_API_KEY out of Git.

## Structure

```
/prompt-quest (this folder)
|-- /Frontend     # React app (Vite + TS)
|-- app.py        # Flask backend entrypoint
|-- requirements.txt
|-- .env.example  # Backend example env (copy to .env and set GEMINI_API_KEY)
|-- package.json  # Root runner using concurrently
|-- .gitignore    # Protects .env and other generated files
```

Note: If you prefer a clean split into /frontend and /backend subfolders, you can move files later:
- Move all frontend files into /frontend
- Move app.py, requirements.txt, levels.py, etc. into /backend
- Update the package.json scripts accordingly (replace `Frontend` with `frontend` and `python app.py` with `python backend/app.py`).

## Prerequisites
- Node.js 18+
- Python 3.10+

## Setup
1) Install Node deps (root) and frontend deps

```cmd
npm run install-all
```

2) Configure the backend API key
- Copy `.env.example` to `.env`
- Set GEMINI_API_KEY in `.env`

3) (Optional) Create a Python virtual environment and install backend deps

```cmd
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Run both servers together

```cmd
npm run dev
```

This runs:
- Frontend dev server (Vite) from `Frontend`
- Flask backend via `python app.py` (default http://localhost:5000)

Tip: Frontend uses `VITE_API_BASE_URL` in `Frontend/.env` to point at the backend. By default it targets http://localhost:5000.

## Deployment readiness
- Secrets are ignored via .gitignore (.env files). Commit `.env.example` only.
- For Lovable deployments, provide `GEMINI_API_KEY` as an environment variable and ensure your start commands reflect these scripts or separate CI steps for backend and frontend as needed.

## Production: Enable Gemini API

Set the API key as an environment variable in production. The backend already reads `GEMINI_API_KEY` via `dotenv`/`os.environ`.

- Lovable (recommended): add `GEMINI_API_KEY` in the project’s environment variables UI. No code changes required.
- Custom hosting (Render/Fly/Heroku/VM): configure an environment variable named `GEMINI_API_KEY` and ensure the process runs `python app.py` from the backend root.

Frontend API base URL
- If your backend is not on http://localhost:5000, set `VITE_API_BASE_URL` in `Frontend/.env` (or host env) to the public backend URL, e.g. `https://your-backend.example.com`.

Security tips
- Never commit `.env`. Keep only `.env.example` in Git.
- Restrict the key in Google AI Studio if possible (quotas, referrers, or environment scoping).
- Add basic rate‑limiting and request size limits before opening to the public.

## Push to GitHub (Windows, cmd)

If this folder isn’t yet a repo:

```cmd
git init
git remote add origin https://github.com/sampriti-gopisetti/PromptQuest.git
git add .
git commit -m "feat: unified repo with concurrent dev, docs, and secrets hygiene"
git push -u origin main
```

If it’s already a repo and remote is set, just:

```cmd
git add .
git commit -m "docs: add judge overview and production Gemini setup"
git push
```

## Troubleshooting
- If `concurrently` isn’t found, run `npm install` at repo root to install devDependencies.
- If the backend port is in use, set `PORT=5001` in `.env` and update `Frontend/.env` with `VITE_API_BASE_URL=http://localhost:5001`.
