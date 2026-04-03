import type { ParsedExercise, ParsedWorkout } from "../types/workout.js";

const PLACEHOLDER = "...";

/**
 * Extrai o valor após `**Label:**` até a próxima linha que inicia outro campo `**` ou fim do bloco.
 */
function extractLabeledField(block: string, label: string, optional: boolean): string {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`\\*\\*${escaped}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\s*\\*\\*|$)`, "i");
  const m = block.match(re);
  if (!m) return optional ? "" : PLACEHOLDER;
  const raw = m[1].trim();
  if (!raw) return optional ? "" : PLACEHOLDER;
  return raw;
}

function extractFocus(header: string): string {
  const m = header.match(/\*\*Foco do Dia:\*\*\s*([\s\S]*?)(?=\n\s*\*\*|$)/i);
  if (!m) return "";
  return m[1].trim();
}

function buildExerciseFromBlock(block: string, index: number): ParsedExercise {
  const trimmed = block.trim();
  const noteRaw = extractLabeledField(trimmed, "Nota do Treinador", true);

  return {
    id: `ex-${index}`,
    name: extractLabeledField(trimmed, "Exercício", false),
    setsAndReps: extractLabeledField(trimmed, "Séries e Repetições", false),
    rest: extractLabeledField(trimmed, "Descanso", false),
    load: extractLabeledField(trimmed, "Carga Sugerida", false),
    ...(noteRaw ? { note: noteRaw } : {}),
  };
}

/**
 * Converte o texto em streaming no formato Markdown da API em foco + cards.
 * Funciona com blocos parciais (campos ausentes viram "..." ou vazio para nota opcional).
 */
export function parseAdaptedWorkoutText(rawText: string): ParsedWorkout {
  const text = rawText.trim();
  if (!text) {
    return { focus: "", exercises: [] };
  }

  const segments = text.split(/\s*---\s*/);
  const header = segments[0] ?? "";
  const focus = extractFocus(header);

  const exercises: ParsedExercise[] = [];
  const tail = segments.slice(1);

  for (let i = 0; i < tail.length; i++) {
    const segment = tail[i];
    if (!segment?.trim()) continue;
    exercises.push(buildExerciseFromBlock(segment, i));
  }

  return { focus, exercises };
}
