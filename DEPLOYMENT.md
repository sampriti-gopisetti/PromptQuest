# Deployment Guide (Frontend on Vercel, Backend on Google Cloud Run)

Stable split setup: static Frontend on Vercel, persistent Flask Backend on Google Cloud Run. This avoids serverless complexity and gives you a single Backend URL you can reuse locally and in production.

---

## 1) Backend (Flask on Cloud Run)

Project root: `Backend/`

Already present and required:
- `Backend/app.py` – Flask app with `/health`, `/api/levels`, `/api/evaluate`
- `Backend/levels.py`
- `Backend/requirements.txt` – includes `flask`, `flask-cors`, `python-dotenv`, `google-generativeai`, `gunicorn`
- `Backend/Dockerfile` – container for Cloud Run (added)
- `Backend/.dockerignore`

Steps (gcloud CLI):
1. Authenticate and set project/region
   ```cmd
   gcloud auth login
   gcloud config set project <YOUR_GCP_PROJECT_ID>
   gcloud config set run/region <YOUR_REGION>   ^  e.g. us-central1
   ```
2. Build and deploy to Cloud Run
   ```cmd
   cd Backend
   gcloud builds submit --tag gcr.io/%PROJECT_ID%/promptquest-backend
   gcloud run deploy promptquest-backend ^
     --image gcr.io/%PROJECT_ID%/promptquest-backend ^
     --platform managed ^
     --allow-unauthenticated ^
     --set-env-vars GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
   ```
3. Note the Service URL Cloud Run prints, e.g. `https://promptquest-backend-xxxx-uc.a.run.app`
4. Verify:
   - `GET <SERVICE_URL>/health` returns `{ status: "ok", gemini_configured: true }`
   - `GET <SERVICE_URL>/api/levels`
   - `POST <SERVICE_URL>/api/evaluate`

Notes:
- Store real keys only in Cloud Run env vars (`--set-env-vars`) or Secrets Manager.
- CORS is enabled. Optionally restrict origins in `app.py` for production.

---

## 2) Frontend (Vite on Vercel)

Project root: `Frontend/`

Ensure the Frontend is a pure static site:
- Keep: `package.json`, `vite.config.ts`, `index.html`, `public/`, `src/**`, `.env.example`
- Do not include: `Frontend/api/` directory nor `Frontend/vercel.json`

Environment variable usage:
- The app reads API base from `VITE_API_BASE_URL`.
- In production on Vercel, set `VITE_API_BASE_URL` to your Cloud Run URL.

Steps:
1. In Vercel, create a New Project for the frontend. Set "Root Directory" to `Frontend`.
2. Settings → Environment Variables (Production):
   - `VITE_API_BASE_URL = <SERVICE_URL_FROM_CLOUD_RUN>`
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

- Avoid mixing serverless with this setup
   - Make sure there is no `api/` under repo root or `Frontend/` configured in Vercel. Our root `vercel.json` only builds Frontend and serves `Frontend/dist`.

- API 400/401 errors after deploy
  - Check `GEMINI_API_KEY` is set in Backend project Env Vars and redeploy.
  - Verify `/health` returns `gemini_configured: true`.

- CORS errors
  - Backend already enables CORS. Optionally restrict origins to your Frontend domain for production.

- Wrong API base URL in production
   - Ensure Frontend `VITE_API_BASE_URL` in Vercel points to your Cloud Run URL (e.g., `https://promptquest-backend-xxxx-uc.a.run.app`).

---

## 5) Post-Deploy Checklist

- [ ] Backend `/health` OK and `gemini_configured: true`
- [ ] Frontend loads and calls `.../api/evaluate` without CORS errors
- [ ] Score and feedback appear, flow proceeds to Feedback modal
- [ ] Favicon shows correctly and Lovable branding removed
- [ ] (Optional) Add custom domain(s) and tighten CORS
