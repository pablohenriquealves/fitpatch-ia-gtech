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
 * POST com streaming de texto plano.
 * O backend envia chunks de texto contínuos que são consumidos em tempo real.
 */
export async function streamWorkoutGeneration(
  body: WorkoutCheckInRequest,
  handlers: StreamHandlers,
): Promise<void> {
  const url = `${getWorkoutApiBase().replace(/\/$/, "")}/api/workout/generate`;

  try {
    console.log(
      "[streamWorkoutGeneration] Iniciando requisição POST para:",
      url,
    );
    console.log("[streamWorkoutGeneration] Payload:", body);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log("[streamWorkoutGeneration] Status HTTP:", res.status);
    console.log(
      "[streamWorkoutGeneration] Content-Type:",
      res.headers.get("content-type"),
    );

    const ct = res.headers.get("content-type") ?? "";

    if (!res.ok) {
      console.error("[streamWorkoutGeneration] Resposta não OK:", res.status);

      if (ct.includes("application/json")) {
        try {
          const err = (await res.json()) as {
            error?: string;
            details?: unknown;
          };
          const errorMsg = err.error ?? `Erro HTTP ${res.status}`;
          console.error(
            "[streamWorkoutGeneration] Erro JSON recebido:",
            errorMsg,
            err.details,
          );
          handlers.onError(errorMsg);
          return;
        } catch (parseErr) {
          console.error(
            "[streamWorkoutGeneration] Falha ao parsear erro JSON:",
            parseErr,
          );
        }
      }

      const errorMsg = `Falha na requisição (${res.status})`;
      console.error("[streamWorkoutGeneration]", errorMsg);
      handlers.onError(errorMsg);
      return;
    }

    if (!res.body) {
      const errorMsg = "Resposta sem corpo utilizável para streaming.";
      console.error("[streamWorkoutGeneration]", errorMsg);
      handlers.onError(errorMsg);
      return;
    }

    console.log("[streamWorkoutGeneration] Iniciando consumo do stream...");
    await consumeTextStreamBody(res.body, handlers);
    console.log("[streamWorkoutGeneration] Stream finalizado com sucesso.");
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(
      "[streamWorkoutGeneration] Erro capturado no try/catch:",
      errorMsg,
      err,
    );
    handlers.onError(`Erro ao conectar ao servidor: ${errorMsg}`);
  }
}

/**
 * Consome um stream de texto plano (não SSE).
 * Cada chunk de texto é passado ao handler.
 */
async function consumeTextStreamBody(
  body: ReadableStream<Uint8Array>,
  handlers: StreamHandlers,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();

  try {
    console.log("[consumeTextStreamBody] Iniciando leitura do stream...");

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("[consumeTextStreamBody] Stream finalizado (done=true)");
        handlers.onDone();
        break;
      }

      if (value) {
        const text = decoder.decode(value, { stream: true });
        console.log(
          "[consumeTextStreamBody] Chunk recebido:",
          text.length,
          "caracteres",
        );
        handlers.onTextChunk(text);
      }
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(
      "[consumeTextStreamBody] Erro durante leitura do stream:",
      errorMsg,
      err,
    );
    handlers.onError(`Erro ao ler stream: ${errorMsg}`);
  } finally {
    try {
      reader.releaseLock();
      console.log("[consumeTextStreamBody] Lock do reader liberado.");
    } catch (unlockErr) {
      console.warn("[consumeTextStreamBody] Erro ao liberar lock:", unlockErr);
    }
  }
}
