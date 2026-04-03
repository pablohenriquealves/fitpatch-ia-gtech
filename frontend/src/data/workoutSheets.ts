/** Fichas de exemplo enviadas como `baseWorkoutRoutine`. */
export const WORKOUT_SHEETS: Record<
  string,
  { label: string; baseWorkoutRoutine: string }
> = {
  A: {
    label: "Treino A — Superior",
    baseWorkoutRoutine: `Treino A (superior):
- Supino reto: 4x8-10
- Supino inclinado com halteres: 3x10-12
- Crucifixo na máquina: 3x12-15
- Tríceps corda: 3x12-15
- Tríceps testa com barra W: 3x10-12`,
  },
  B: {
    label: "Treino B — Inferior",
    baseWorkoutRoutine: `Treino B (inferior):
- Agachamento livre: 4x8-10
- Leg press 45°: 3x12-15
- Cadeira extensora: 3x15-20
- Stiff com halteres: 3x10-12
- Panturrilha em pé: 4x15-20`,
  },
};

export const DEFAULT_SHEET_KEY = "A" as keyof typeof WORKOUT_SHEETS;
