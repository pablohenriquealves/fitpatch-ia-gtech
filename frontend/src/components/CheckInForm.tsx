import { Minus, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { DEFAULT_SHEET_KEY, WORKOUT_SHEETS } from "../data/workoutSheets.js";
import type { WorkoutCheckInRequest } from "../types/workout.js";

const MIN_MINUTES = 15;
const MAX_MINUTES = 180;
const STEP = 15;
const DEFAULT_MINUTES = 90;

function energyToFatigueLevel(energy: number): number {
  return 6 - energy;
}

export interface CheckInFormProps {
  onSubmit: (payload: WorkoutCheckInRequest) => void;
  loading?: boolean;
}

export function CheckInForm({ onSubmit, loading }: CheckInFormProps) {
  const [sheetKey, setSheetKey] = useState<string>(DEFAULT_SHEET_KEY);
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);
  const [energy, setEnergy] = useState(3);

  const sheet = WORKOUT_SHEETS[sheetKey] ?? WORKOUT_SHEETS[DEFAULT_SHEET_KEY];

  const adjustMinutes = (delta: number) => {
    setMinutes((m) => Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, m + delta)));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: WorkoutCheckInRequest = {
      baseWorkoutRoutine: sheet.baseWorkoutRoutine,
      availableTimeMinutes: minutes,
      fatigueLevel: energyToFatigueLevel(energy),
      historyNotes: "",
    };
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-6 rounded-xl border border-neutral-800 bg-neutral-900 p-5 shadow-lg"
    >
      <div>
        <label
          htmlFor="sheet"
          className="mb-2 block text-sm font-medium text-neutral-400"
        >
          Ficha de treino
        </label>
        <select
          id="sheet"
          value={sheetKey}
          onChange={(e) => setSheetKey(e.target.value)}
          disabled={loading}
          className="w-full appearance-none rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-white outline-none ring-red-500/30 transition focus:ring-2"
        >
          {Object.entries(WORKOUT_SHEETS).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-neutral-400">
          Tempo disponível (min)
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => adjustMinutes(-STEP)}
            disabled={loading || minutes <= MIN_MINUTES}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 text-white transition hover:bg-neutral-800 disabled:opacity-40"
            aria-label="Diminuir 15 minutos"
          >
            <Minus className="h-5 w-5 text-red-500" strokeWidth={2.5} />
          </button>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={MIN_MINUTES}
            max={MAX_MINUTES}
            value={minutes}
            onChange={(e) => {
              const v = Number.parseInt(e.target.value, 10);
              if (Number.isFinite(v)) {
                setMinutes(Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, v)));
              }
            }}
            disabled={loading}
            className="w-full max-w-[5.5rem] border-b border-neutral-700 bg-transparent text-center text-2xl font-semibold text-white outline-none"
          />
          <button
            type="button"
            onClick={() => adjustMinutes(STEP)}
            disabled={loading || minutes >= MAX_MINUTES}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 text-white transition hover:bg-neutral-800 disabled:opacity-40"
            aria-label="Aumentar 15 minutos"
          >
            <Plus className="h-5 w-5 text-red-500" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="energy" className="text-sm font-medium text-neutral-400">
            Nível de energia
          </label>
          <span className="text-sm font-semibold text-red-500">{energy}</span>
        </div>
        <input
          id="energy"
          type="range"
          min={1}
          max={5}
          step={1}
          value={energy}
          onChange={(e) => setEnergy(Number(e.target.value))}
          disabled={loading}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-950 accent-red-600"
        />
        <div className="mt-1 flex justify-between text-xs text-neutral-500">
          <span>Baixa</span>
          <span>Alta</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-red-500 disabled:opacity-60"
      >
        {loading ? "Gerando…" : "Gerar treino"}
      </button>
    </form>
  );
}
