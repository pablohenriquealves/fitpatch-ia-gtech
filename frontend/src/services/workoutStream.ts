import type { WorkoutCheckInRequest } from "../types/workout.js";

const DEFAULT_BASE = "http://localhost:3000";

export function getWorkoutApiBase(): string {
  return import.meta.env.VITE_API_BASE?.trim() || DEFAULT_BASE;
}

export interface StreamHandlers {
  onTextChunk: (text: string) => void;
  onDone: () => void;
  onError: (message: string) => void;
}

/**
 * POST com SSE: consome `data: {"text":"..."}` e eventos `done` / `error`.
 */
export async function streamWorkoutGeneration(
  body: WorkoutCheckInRequest,
  handlers: StreamHandlers
): Promise<void> {
  const url = `${getWorkoutApiBase().replace(/\/$/, "")}/api/workout/generate-stream`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const ct = res.headers.get("content-type") ?? "";

  if (!res.ok) {
    if (ct.includes("application/json")) {
      const err = (await res.json()) as { error?: string };
      handlers.onError(err.error ?? `Erro HTTP ${res.status}`);
      return;
    }
    handlers.onError(`Falha na requisição (${res.status})`);
    return;
  }

  if (!res.body) {
    handlers.onError("Resposta sem corpo utilizável para streaming.");
    return;
  }

  await consumeSseBody(res.body, handlers);
}

async function consumeSseBody(
  body: ReadableStream<Uint8Array>,
  handlers: StreamHandlers
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let carry = "";
  let finished = false;

  const safeDone = () => {
    if (finished) return;
    finished = true;
    handlers.onDone();
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      carry += decoder.decode(value, { stream: true });

      let sep: number;
      while ((sep = carry.indexOf("\n\n")) !== -1) {
        const raw = carry.slice(0, sep);
        carry = carry.slice(sep + 2);
        if (dispatchSseEvent(raw, handlers)) {
          finished = true;
          return;
        }
      }
    }
    if (carry.trim()) {
      if (dispatchSseEvent(carry, handlers)) {
        return;
      }
    }
    safeDone();
  } finally {
    reader.releaseLock();
  }
}

/** @returns true se o stream deve encerrar (done ou error). */
function dispatchSseEvent(rawBlock: string, handlers: StreamHandlers): boolean {
  let eventName = "";
  let dataPayload = "";

  for (const line of rawBlock.split("\n")) {
    if (line.startsWith("event:")) {
      eventName = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      dataPayload += line.slice(5).trimStart();
    }
  }

  if (!dataPayload) return false;

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(dataPayload) as Record<string, unknown>;
  } catch {
    return false;
  }

  if (eventName === "error" || typeof data.error === "string") {
    handlers.onError(String(data.error ?? "Erro no stream"));
    return true;
  }

  if (eventName === "done") {
    handlers.onDone();
    return true;
  }

  if (typeof data.text === "string" && data.text.length > 0) {
    handlers.onTextChunk(data.text);
  }

  return false;
}
