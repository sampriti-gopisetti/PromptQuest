import os
import json
from typing import Any, Dict, Optional, Tuple

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

try:
    # Teammate-provided module; we handle absence gracefully for local dev.
    from levels import get_level_details  # type: ignore
except Exception as e:  # pragma: no cover - fallback for missing teammate file
    get_level_details = None  # type: ignore

    def _missing_levels_warning(*args: Any, **kwargs: Any) -> None:
        pass

    def get_level_details(_level_id: str) -> Optional[Dict[str, Any]]:  # type: ignore[no-redef]
        # Fallback stub so the server can still boot in environments without levels.py
        return None

import google.generativeai as genai


# -------------------------------------
# App setup
# -------------------------------------
load_dotenv()
app = Flask(__name__)
CORS(app)

# Configure Gemini client
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

# Optional model override via env
DEFAULT_MODEL_CANDIDATES = [
    # Preferred order; we'll auto-fallback to the next available
    os.getenv("GEMINI_MODEL", "gemini-1.5-pro-latest"),
    # "gemini-1.5-pro",
    # "gemini-1.5-pro-002",
    "gemini-1.5-flash",
    "gemini-1.5-flash-002",
]


def _strip_models_prefix(name: str) -> str:
    # Convert "models/gemini-1.5-pro" -> "gemini-1.5-pro"
    return name.split("/", 1)[1] if name.startswith("models/") else name


def _resolve_model_id(preferred: list[str] | None = None) -> str:
    """Select a compatible model id available for generateContent.

    Strategy:
    1) List available models and supported methods.
    2) Choose the first preferred id that appears in the available models.
    3) As a last resort, return the first available model that supports generateContent.
    """
    if not API_KEY:
        # Will be handled later as ValueError
        return DEFAULT_MODEL_CANDIDATES[0]

    preferred = preferred or DEFAULT_MODEL_CANDIDATES

    try:
        models = list(genai.list_models())
    except Exception:
        # If we can't list models (network/policy), just return the first preferred
        return preferred[0]

    # Build a set of available short names that support generateContent
    available = []
    available_set = set()
    for m in models:
        try:
            methods = set(getattr(m, "supported_generation_methods", []) or [])
            if "generateContent" not in methods:
                continue
            short = _strip_models_prefix(getattr(m, "name", ""))
            if short:
                available.append(short)
                available_set.add(short)
        except Exception:
            continue

    # Pick first preferred present
    for pid in preferred:
        if pid in available_set:
            return pid

    # Fallback to first available
    if available:
        return available[0]

    # Ultimate fallback: keep original
    return preferred[0]


def _extract_json_text_from_response(resp: Any) -> str:
    """Best-effort extraction of JSON string from a Gemini response object.
    Supports both standard text and JSON-mode outputs.
    """
    # Common case: JSON string available via .text
    text = getattr(resp, "text", None)
    if text:
        return text

    # Fallback: iterate parts to find text or JSON blob
    try:
        candidates = getattr(resp, "candidates", [])
        if not candidates:
            raise ValueError("No candidates in Gemini response")
        content = getattr(candidates[0], "content", None)
        parts = getattr(content, "parts", []) if content else []
        for part in parts:
            # Some SDK versions expose text directly
            if hasattr(part, "text") and part.text:
                return part.text
            # Some expose inline_data for non-text payloads
            inline = getattr(part, "inline_data", None)
            if inline is not None:
                data = getattr(inline, "data", None)
                if data:
                    try:
                        return data.decode("utf-8") if isinstance(data, (bytes, bytearray)) else str(data)
                    except Exception:
                        return str(data)
    except Exception as e:
        raise ValueError(f"Failed to parse Gemini response: {e}")

    raise ValueError("Unable to extract text from Gemini response")


def call_gemini_judge(challenge_goal: str, user_prompt: str) -> Dict[str, Any]:
    """Call Gemini judge with strict JSON response mode and return parsed dict.

    Returns a dict with keys: "score" (0-100) and "feedback" (string).
    Raises ValueError on client-side issues; RuntimeError on model/response issues.
    """
    if not API_KEY:
        raise ValueError("Missing GEMINI_API_KEY environment variable")

    generation_config = {
        "response_mime_type": "application/json",
    }

    model_id = _resolve_model_id()
    model = genai.GenerativeModel(
        model_id,
        generation_config=generation_config,
    )

    judge_master_prompt = f"""
Challenge goal: {challenge_goal}

Player's prompt: {user_prompt}

I gave the challenge goal above to a player and asked them to propose a prompt for an AI model. Their prompt is above. I want you to score their prompt on a score of 0-100 while keeping the following in mind. Using a prompt that is the same as, or very similar to the challenge goal text may lead to a "correct" response, but it may not be the best prompt. A better prompt might need to include more context such as, but not limited to:
* Format/Data Structure (e.g., number of bullets, JSON, table)
* Tone/Persona (e.g., writing as a pirate, explaining to a child)
* Ambiguity Reduction (e.g., defining vague terms like "best" or "current")
* Procedural Guidance (e.g., requesting step-by-step reasoning or Chain-of-Thought)
* Exclusionary Constraints (e.g., telling the AI what to omit, like greetings or jargon)
* Tool Usage (e.g., explicitly requesting the use of the Google Search tool)

You MUST provide your response as a JSON object with two keys: "score" (a number from 0-100) and "feedback" (a string explaining the score and how to improve).
"""

    try:
        response = model.generate_content(judge_master_prompt)
        raw_json = _extract_json_text_from_response(response)
        data = json.loads(raw_json)
        # Basic schema guard
        if not isinstance(data, dict) or "score" not in data or "feedback" not in data:
            raise RuntimeError("Model response missing required keys 'score' and 'feedback'")
        return data
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Model returned non-JSON or invalid JSON: {e}")
    except Exception as e:
        # Try a soft fallback if the error suggests missing model support
        err_msg = str(e)
        if any(tok in err_msg for tok in ["not found", "ListModels", "supported for generateContent"]):
            try:
                # Re-resolve model id using a refreshed listing and retry once
                alt_id = _resolve_model_id()
                if alt_id:
                    alt_model = genai.GenerativeModel(alt_id, generation_config=generation_config)
                    response = alt_model.generate_content(judge_master_prompt)
                    raw_json = _extract_json_text_from_response(response)
                    data = json.loads(raw_json)
                    if not isinstance(data, dict) or "score" not in data or "feedback" not in data:
                        raise RuntimeError("Model response missing required keys 'score' and 'feedback'")
                    return data
            except Exception:
                pass
        raise RuntimeError(f"Gemini judge call failed: {e}")


# -------------------------------------
# Routes
# -------------------------------------
@app.get("/health")
def health() -> Tuple[Any, int]:
    status = {
        "status": "ok",
        "gemini_configured": bool(API_KEY),
    }
    return jsonify(status), 200


@app.get("/api/levels/<level_id>")
def get_level(level_id: str) -> Tuple[Any, int]:
    try:
        if get_level_details is None:
            return jsonify({"error": "levels module not available"}), 501
        details = get_level_details(level_id)
        if not details:
            return jsonify({"error": "level not found", "level_id": level_id}), 404
        return jsonify(details), 200
    except Exception as e:
        return jsonify({"error": "failed to retrieve level", "details": str(e)}), 500


@app.get("/api/models")
def list_models_route() -> Tuple[Any, int]:
    try:
        if not API_KEY:
            return jsonify({"error": "GEMINI_API_KEY missing"}), 400
        items = []
        for m in genai.list_models():
            try:
                items.append({
                    "name": getattr(m, "name", ""),
                    "id": _strip_models_prefix(getattr(m, "name", "")),
                    "supported_generation_methods": getattr(m, "supported_generation_methods", []),
                })
            except Exception:
                continue
        resolved = _resolve_model_id()
        return jsonify({"resolved_model": resolved, "models": items}), 200
    except Exception as e:
        return jsonify({"error": "failed to list models", "details": str(e)}), 500


@app.post("/api/evaluate")
def evaluate() -> Tuple[Any, int]:
    try:
        payload = request.get_json(silent=True) or {}
        level_id = payload.get("level_id")
        user_prompt = payload.get("user_prompt")

        missing = [k for k in ("level_id", "user_prompt") if not payload.get(k)]
        if missing:
            return (
                jsonify({"error": "missing required fields", "missing": missing}),
                400,
            )

        if get_level_details is None:
            return jsonify({"error": "levels module not available"}), 501

        level = get_level_details(level_id)
        if not level:
            return jsonify({"error": "level not found", "level_id": level_id}), 404

        challenge_goal = level.get("quest_scenario") or level.get("challenge_goal")
        if not challenge_goal:
            return (
                jsonify({
                    "error": "level configuration invalid: missing 'quest_scenario'",
                    "level_id": level_id,
                }),
                500,
            )

        result = call_gemini_judge(str(challenge_goal), str(user_prompt))
        return jsonify(result), 200

    except ValueError as ve:
        # Client-side errors (e.g., missing API key)
        return jsonify({"error": str(ve)}), 400
    except RuntimeError as re:
        return jsonify({"error": str(re)}), 502
    except Exception as e:
        return jsonify({"error": "internal server error", "details": str(e)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)
