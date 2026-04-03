import { Router, type Request, type Response } from "express";
import type { WorkoutCheckInRequest } from "../types/workout.js";
import { streamAdaptedWorkout } from "../services/gemini.js";

export const workoutRouter = Router();

function parseBody(body: unknown): WorkoutCheckInRequest {
  if (!body || typeof body !== "object") {
    throw new Error("Body JSON inválido ou ausente.");
  }
  const b = body as Record<string, unknown>;
  const baseWorkoutRoutine = b.baseWorkoutRoutine;
  const availableTimeMinutes = b.availableTimeMinutes;
  const fatigueLevel = b.fatigueLevel;
  const historyNotes = b.historyNotes;

  if (typeof baseWorkoutRoutine !== "string" || !baseWorkoutRoutine.trim()) {
    throw new Error("baseWorkoutRoutine é obrigatório e deve ser uma string não vazia.");
  }
  if (typeof availableTimeMinutes !== "number" || !Number.isFinite(availableTimeMinutes) || availableTimeMinutes <= 0) {
    throw new Error("availableTimeMinutes deve ser um número positivo.");
  }
  if (typeof fatigueLevel !== "number" || !Number.isInteger(fatigueLevel) || fatigueLevel < 1 || fatigueLevel > 5) {
    throw new Error("fatigueLevel deve ser um inteiro entre 1 e 5.");
  }
  if (typeof historyNotes !== "string") {
    throw new Error("historyNotes deve ser uma string.");
  }

  return {
    baseWorkoutRoutine: baseWorkoutRoutine.trim(),
    availableTimeMinutes,
    fatigueLevel,
    historyNotes: historyNotes.trim(),
  };
}

function setSseHeaders(res: Response): void {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
}

/**
 * POST /api/workout/generate-stream
 * Envia a resposta do Gemini em SSE (Server-Sent Events).
 */
workoutRouter.post("/generate-stream", async (req: Request, res: Response) => {
  let payload: WorkoutCheckInRequest;
  try {
    payload = parseBody(req.body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao validar o corpo da requisição.";
    res.status(400).json({ error: message });
    return;
  }

  setSseHeaders(res);
  res.flushHeaders?.();

  try {
    const stream = await streamAdaptedWorkout(payload);
    for await (const { text } of stream) {
      const line = `data: ${JSON.stringify({ text })}\n\n`;
      res.write(line);
    }
    res.write("event: done\ndata: {}\n\n");
    res.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha ao gerar o treino.";
    const payloadErr = JSON.stringify({ error: message });
    res.write(`event: error\ndata: ${payloadErr}\n\n`);
    res.end();
  }
});
