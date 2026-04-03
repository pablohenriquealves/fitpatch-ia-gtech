/** Alinhado ao corpo esperado pelo back-end (`backend/src/types/workout.ts`). */
export interface WorkoutCheckInRequest {
  baseWorkoutRoutine: string;
  availableTimeMinutes: number;
  fatigueLevel: number;
  historyNotes: string;
}

/** Exercício extraído do Markdown padronizado da API (streaming-safe). */
export interface ParsedExercise {
  id: string;
  name: string;
  setsAndReps: string;
  rest: string;
  load: string;
  note?: string;
}

/** Treino parseado a partir do texto bruto (foco + blocos após `---`). */
export interface ParsedWorkout {
  focus: string;
  exercises: ParsedExercise[];
}
