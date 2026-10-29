import { z } from "zod";

/**
 * Schema Zod para validar o corpo da requisição de check-in de treino.
 */
export const workoutCheckInSchema = z.object({
  baseWorkoutRoutine: z.string().min(1, "baseWorkoutRoutine é obrigatório"),
  availableTimeMinutes: z
    .number()
    .min(15, "Tempo mínimo: 15 minutos")
    .max(180, "Tempo máximo: 180 minutos"),
  fatigueLevel: z.number().min(1, "Nível mínimo: 1").max(5, "Nível máximo: 5"),
  historyNotes: z.string().optional(),
});

/**
 * Tipo inferido do schema Zod para validação em tempo de compilação.
 */
export type WorkoutCheckInRequest = z.infer<typeof workoutCheckInSchema>;
