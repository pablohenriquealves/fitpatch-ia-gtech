export interface MuscleGroup {
  id: string;
  label: string;
}

export const MUSCLE_GROUPS: MuscleGroup[] = [
  { id: "peitoral", label: "Peitoral" },
  { id: "costas", label: "Costas" },
  { id: "ombros", label: "Ombros" },
  { id: "biceps", label: "Bíceps" },
  { id: "triceps", label: "Tríceps" },
  { id: "antebraco", label: "Antebraço" },
  { id: "quadriceps", label: "Quadríceps" },
  { id: "posterior", label: "Posterior de Coxa" },
  { id: "gluteo", label: "Glúteos" },
  { id: "panturrilha", label: "Panturrilhas" },
  { id: "abdomen", label: "Abdômen" },
];

export interface WorkoutPreset {
  id: string;
  label: string;
  shortLabel: string;
  muscleIds: string[];
}

export const WORKOUT_PRESETS: WorkoutPreset[] = [
  {
    id: "upper",
    label: "Upper (Peito, Costas, Ombros, Braços)",
    shortLabel: "Upper",
    muscleIds: ["peitoral", "costas", "ombros", "biceps", "triceps", "antebraco"],
  },
  {
    id: "lower",
    label: "Lower (Pernas Completas)",
    shortLabel: "Lower",
    muscleIds: ["quadriceps", "posterior", "gluteo", "panturrilha"],
  },
  {
    id: "arms",
    label: "Braços (Bíceps, Tríceps, Antebraço)",
    shortLabel: "Braços",
    muscleIds: ["biceps", "triceps", "antebraco"],
  },
  {
    id: "fullbody",
    label: "Full Body (Geral)",
    shortLabel: "Full Body",
    muscleIds: ["peitoral", "costas", "quadriceps", "posterior", "ombros", "abdomen"],
  },
  {
    id: "legs",
    label: "Legs (Quadríceps, Posterior, Glúteo, Panturrilha)",
    shortLabel: "Legs",
    muscleIds: ["quadriceps", "posterior", "gluteo", "panturrilha"],
  },
  {
    id: "pull",
    label: "Pull (Costas, Bíceps, Antebraço)",
    shortLabel: "Pull",
    muscleIds: ["costas", "biceps", "antebraco"],
  },
  {
    id: "push",
    label: "Push (Peitoral, Ombros, Tríceps)",
    shortLabel: "Push",
    muscleIds: ["peitoral", "ombros", "triceps"],
  },
];

export const DEFAULT_SELECTED_MUSCLES = [
  "peitoral",
  "ombros",
  "triceps",
];

/**
 * Constrói a descrição contextual da rotina base a partir dos músculos selecionados
 * para enviar ao modelo de IA.
 */
export function buildRoutineFromMuscles(selectedIds: string[]): string {
  if (selectedIds.length === 0) {
    return "Treino geral adaptado para hipertrofia muscular.";
  }

  const selectedLabels = selectedIds
    .map((id) => MUSCLE_GROUPS.find((m) => m.id === id)?.label)
    .filter(Boolean);

  return `Treino do dia com foco exclusivo nos seguintes grupos musculares:
- Agrupamentos selecionados: ${selectedLabels.join(", ")}
Adapte as séries, repetições e seleção de exercícios para trabalhar de forma equilibrada todos os grupos musculares informados dentro do tempo disponível.`;
}

/** Compatibilidade retroativa */
export const WORKOUT_SHEETS: Record<
  string,
  { label: string; baseWorkoutRoutine: string }
> = {
  push: {
    label: "Push",
    baseWorkoutRoutine: buildRoutineFromMuscles(WORKOUT_PRESETS[4].muscleIds),
  },
  pull: {
    label: "Pull",
    baseWorkoutRoutine: buildRoutineFromMuscles(WORKOUT_PRESETS[3].muscleIds),
  },
  legs: {
    label: "Legs",
    baseWorkoutRoutine: buildRoutineFromMuscles(WORKOUT_PRESETS[2].muscleIds),
  },
};

export const DEFAULT_SHEET_KEY = "push" as keyof typeof WORKOUT_SHEETS;
