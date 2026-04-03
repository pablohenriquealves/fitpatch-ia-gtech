/**
 * Corpo da requisição para check-in e geração de treino adaptado.
 */
export interface WorkoutCheckInRequest {
  baseWorkoutRoutine: string;
  availableTimeMinutes: number;
  fatigueLevel: number;
  historyNotes: string;
}
