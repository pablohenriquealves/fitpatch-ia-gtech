import { Router, type Request, type Response } from "express";
import {
  workoutCheckInSchema,
  type WorkoutCheckInRequest,
} from "../types/workout.js";
import { generateWorkoutStream } from "../services/gemini.js";

export const workoutRouter = Router();

/**
 * POST /api/workout/generate
 * Passo 1: Valida o corpo da requisição usando Zod
 * Passo 2: Configura headers para streaming
 * Passo 3: Chama o serviço Gemini
 * Passo 4: Envia o stream de resposta para o cliente
 * Passo 5: Finaliza a resposta com res.end()
 */
workoutRouter.post("/generate", async (req: Request, res: Response) => {
  try {
    // Passo 1: Validar o req.body usando o workoutCheckInSchema.safeParse
    const validationResult = workoutCheckInSchema.safeParse(req.body);
    if (!validationResult.success) {
      // Retornar status 400 com detalhes do erro Zod
      res.status(400).json({
        error: "Validação falhou",
        details: validationResult.error.errors,
      });
      return;
    }

    const validatedData: WorkoutCheckInRequest = validationResult.data;

    // Passo 2: Configurar os headers de resposta para streaming
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache, no-transform");

    // Passo 3: Chamar generateWorkoutStream passando os dados validados
    const stream = await generateWorkoutStream(validatedData);

    // Passo 4: Iterar sobre o stream retornado pelo Gemini
    for await (const chunk of stream) {
      // Usar res.write(chunk.text) para enviar o texto gradualmente ao cliente
      res.write(chunk.text());
    }

    // Passo 5: Finalizar com res.end()
    res.end();
  } catch (err) {
    // Bloco try/catch para lidar com erros da API do Gemini
    const errorMessage =
      err instanceof Error ? err.message : "Erro desconhecido ao gerar treino";

    // Retornar status 500 em caso de erro
    res.status(500).json({
      error: "Erro ao gerar treino",
      message: errorMessage,
    });
  }
});
