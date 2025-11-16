// Default to same-origin in production. In local dev, set VITE_API_BASE_URL=http://localhost:5000
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export interface EvaluateRequest {
  level_id: string;
  user_prompt: string;
}

export interface EvaluateResponse {
  score: number;
  feedback: string;
}

export async function evaluatePrompt(body: EvaluateRequest): Promise<EvaluateResponse> {
  const res = await fetch(`${API_BASE}/api/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = await res.text().catch(() => "");
    try { detail = JSON.parse(detail); } catch {}
    throw new Error(`Evaluate failed (${res.status}): ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
  }
  return res.json();
}

export interface LevelDetails {
  id: string;
  title?: string;
  quest_scenario?: string;
  challenge_goal?: string;
}

export async function getLevelDetails(level_id: string): Promise<LevelDetails> {
  const res = await fetch(`${API_BASE}/api/levels/${encodeURIComponent(level_id)}`);
  if (!res.ok) {
    throw new Error(`Failed to load level ${level_id}: ${res.status}`);
  }
  return res.json();
}
