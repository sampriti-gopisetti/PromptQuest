# Backend Dockerfile for Google Cloud Run
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# System deps (optional: build-essential if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy app
COPY . .

# Cloud Run expects to listen on $PORT
ENV PORT=8080
EXPOSE 8080

# Use gunicorn to serve Flask app
CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app"]
