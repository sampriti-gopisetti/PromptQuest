# PromptQuest Vercel Deployment Guide

This project deploys as two Vercel projects:
- Frontend: Vite React app (static site)
- Backend: Flask API (serverless Python)

Follow these steps carefully. If you previously tried a single-domain setup, remove any `api/` or `vercel.json` from the Frontend before deploying.

---

## 1) Backend (Flask API)

Project root: `Backend/`

Already present and required:
- `Backend/app.py` – Flask app with routes `/health`, `/api/levels`, `/api/evaluate`
- `Backend/api/index.py` – WSGI adapter for Vercel (`vercel_python_wsg`)
- `Backend/requirements.txt` – includes `vercel-python-wsgi`, `flask`, `flask-cors`, `python-dotenv`, `google-generativeai`
- `Backend/vercel.json` – routes `/api/*` and `/health` to `api/index.py` with `python3.11` runtime
- `Backend/levels.py`
- `Backend/.env.example` – do not commit real keys

Steps:
1. In Vercel, create a New Project for the backend. Set "Root Directory" to `Backend`.
2. Settings → Environment Variables:
   - `GEMINI_API_KEY = <your key>` (Production; add Preview if needed)
3. Build & Development Settings:
   - Framework Preset: Other
   - Install Command: `pip install -r requirements.txt`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
4. Deploy.
5. Verify the deployment:
   - `https://<your-backend>.vercel.app/health` returns `{ status: "ok", gemini_configured: true }`.
   - API endpoints:
     - `GET https://<your-backend>.vercel.app/api/levels`
     - `POST https://<your-backend>.vercel.app/api/evaluate`

Notes:
- Never store real keys in git. Put them in Vercel Env Vars.
- Optional CORS hardening: In `app.py`, you can restrict origins, e.g. `CORS(app, resources={r"/*": {"origins": "https://<your-frontend>.vercel.app"}})` once your Frontend URL is known.

---

## 2) Frontend (Vite React)

Project root: `Frontend/`

Ensure the Frontend is a pure static site:
- Keep: `package.json`, `vite.config.ts`, `index.html`, `public/`, `src/**`, `.env.example`
- Do not include: `Frontend/api/` directory nor `Frontend/vercel.json`

Environment variable usage:
- The app reads API base from `VITE_API_BASE_URL`.
- In production, set `VITE_API_BASE_URL` to your backend URL (below).

Steps:
1. In Vercel, create a New Project for the frontend. Set "Root Directory" to `Frontend`.
2. Settings → Environment Variables (Production):
   - `VITE_API_BASE_URL = https://<your-backend>.vercel.app`
3. Build & Development Settings:
   - Framework Preset: Vite
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy.
5. Verify in the browser and Network tab:
   - Requests go to `https://<your-backend>.vercel.app/api/evaluate` and `/api/levels/...`.

Optional: `.vercelignore` for Frontend (already added). It ignores dev/test files and `api/` if created locally.

---

## 3) Local Development

Backend (Flask):
```cmd
cd Backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Edit .env and set GEMINI_API_KEY
python app.py
```
Backend runs at `http://localhost:5000`.

Frontend (Vite):
```cmd
cd Frontend
npm install
copy .env.example .env.local
# Edit .env.local with:
# VITE_API_BASE_URL=http://localhost:5000
npm run dev
```

---

## 4) Common Pitfalls and Fixes

- Error: "Function Runtimes must have a valid version, for example now-php@1.0.0"
  - Cause: Vercel detected serverless function files in Frontend (e.g., `Frontend/api/**` or `Frontend/vercel.json`).
  - Fix: Remove `Frontend/api/**` and `Frontend/vercel.json`. Ensure Frontend root in Vercel is `Frontend/` and re-deploy (clear cache).

- API 400/401 errors after deploy
  - Check `GEMINI_API_KEY` is set in Backend project Env Vars and redeploy.
  - Verify `/health` returns `gemini_configured: true`.

- CORS errors
  - Backend already enables CORS. Optionally restrict origins to your Frontend domain for production.

- Wrong API base URL in production
  - Ensure Frontend `VITE_API_BASE_URL` in Vercel points to your Backend URL (e.g., `https://<your-backend>.vercel.app`).

---

## 5) Post-Deploy Checklist

- [ ] Backend `/health` OK and `gemini_configured: true`
- [ ] Frontend loads and calls `.../api/evaluate` without CORS errors
- [ ] Score and feedback appear, flow proceeds to Feedback modal
- [ ] Favicon shows correctly and Lovable branding removed
- [ ] (Optional) Add custom domain(s) and tighten CORS
