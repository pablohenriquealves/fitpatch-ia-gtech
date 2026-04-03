import { Check } from "lucide-react";
import { useState } from "react";
import type { ParsedExercise } from "../types/workout.js";

export interface ExerciseCardProps {
  exercise: ParsedExercise;
}

function Row({ label, value }: { label: string; value: string }) {
  if (value === "") return null;
  return (
    <div className="text-sm">
      <span className="text-neutral-500">{label}: </span>
      <span className="text-neutral-400">{value}</span>
    </div>
  );
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [loadDone, setLoadDone] = useState("");
  const [repsDone, setRepsDone] = useState("");
  const [done, setDone] = useState(false);

  const { name, setsAndReps, rest, load, note } = exercise;

  return (
    <div
      className={`w-[300px] shrink-0 rounded-xl border border-neutral-800 bg-neutral-900 p-4 transition-opacity ${
        done ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-white">{name}</h3>

          <div className="mt-2 space-y-1.5">
            <Row label="Séries e repetições" value={setsAndReps} />
            <Row label="Descanso" value={rest} />
            <Row label="Carga sugerida" value={load} />
            {note !== undefined && note !== "" && (
              <Row label="Nota do treinador" value={note} />
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="block">
              <span className="mb-1 block text-xs text-neutral-500">Carga realizada</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="kg"
                min={0}
                value={loadDone}
                onChange={(e) => setLoadDone(e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-sm text-white outline-none ring-red-500/20 focus:ring-1"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-neutral-500">Reps feitas</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="0"
                min={0}
                value={repsDone}
                onChange={(e) => setRepsDone(e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-sm text-white outline-none ring-red-500/20 focus:ring-1"
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col items-center justify-start pt-1">
          <button
            type="button"
            onClick={() => setDone((d) => !d)}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition ${
              done
                ? "border-red-600 bg-red-600 text-white"
                : "border-neutral-700 bg-neutral-950 text-neutral-400 hover:border-red-500/50 hover:text-red-500"
            }`}
            aria-label={done ? "Desmarcar concluído" : "Concluir exercício"}
          >
            <Check className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
