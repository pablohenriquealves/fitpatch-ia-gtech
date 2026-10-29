import { Check, Minus, Plus, RotateCcw } from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  DEFAULT_SELECTED_MUSCLES,
  MUSCLE_GROUPS,
  WORKOUT_PRESETS,
  buildRoutineFromMuscles,
} from "../data/workoutSheets";
import type { WorkoutCheckInRequest } from "../types/workout";

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
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(
    DEFAULT_SELECTED_MUSCLES,
  );
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);
  const [energy, setEnergy] = useState(3);

  const toggleMuscle = (id: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const applyPreset = (muscleIds: string[]) => {
    setSelectedMuscles([...muscleIds]);
  };

  const clearAllMuscles = () => {
    setSelectedMuscles([]);
  };

  const adjustMinutes = (delta: number) => {
    setMinutes((m) => Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, m + delta)));
  };

  const isPresetActive = (muscleIds: string[]) => {
    if (muscleIds.length !== selectedMuscles.length) return false;
    return muscleIds.every((id) => selectedMuscles.includes(id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedMuscles.length === 0) return;

    const routineDescription = buildRoutineFromMuscles(selectedMuscles);

    const payload: WorkoutCheckInRequest = {
      baseWorkoutRoutine: routineDescription,
      availableTimeMinutes: minutes,
      fatigueLevel: energyToFatigueLevel(energy),
      historyNotes: "",
    };
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-6 rounded-xl border border-neutral-800 bg-neutral-900 p-5 shadow-lg"
    >
      {/* Target Muscles Selection */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <label className="text-sm font-medium text-neutral-400">
            Target Muscles
          </label>
          <span className="text-xs text-neutral-400">
            {selectedMuscles.length === 0 ? (
              <span className="text-amber-400">None selected</span>
            ) : (
              <span className="text-red-400 font-medium">
                {selectedMuscles.length}{" "}
                {selectedMuscles.length === 1 ? "muscle" : "muscles"}
              </span>
            )}
          </span>
        </div>

        {/* Compact Alphabetical Muscle Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MUSCLE_GROUPS.map((muscle) => {
            const isSelected = selectedMuscles.includes(muscle.id);
            return (
              <button
                key={muscle.id}
                type="button"
                onClick={() => toggleMuscle(muscle.id)}
                disabled={loading}
                aria-pressed={isSelected}
                className={`flex h-11 items-center justify-between px-3 rounded-lg border text-sm transition select-none active:scale-[0.98] ${
                  isSelected
                    ? "border-red-500 bg-red-950/40 text-white font-medium ring-1 ring-red-500/30"
                    : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                } disabled:opacity-50`}
              >
                <span className="truncate">{muscle.label}</span>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded transition ${
                    isSelected
                      ? "bg-red-600 text-white"
                      : "border border-neutral-800 bg-neutral-900 text-transparent"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              </button>
            );
          })}
        </div>

        {/* Presets & Quick Shortcuts */}
        <div className="mt-3 pt-3 border-t border-neutral-800/80">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">
              Workout Splits
            </span>
            {selectedMuscles.length > 0 && (
              <button
                type="button"
                onClick={clearAllMuscles}
                disabled={loading}
                className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-red-400 transition"
              >
                <RotateCcw className="h-3 w-3" />
                Limpar
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {WORKOUT_PRESETS.map((preset) => {
              const active = isPresetActive(preset.muscleIds);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.muscleIds)}
                  disabled={loading}
                  className={`px-2.5 py-1.5 text-xs rounded-md border transition ${
                    active
                      ? "border-red-600 bg-red-950/60 text-white font-medium shadow-sm"
                      : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-white"
                  } disabled:opacity-50`}
                >
                  {preset.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Available Time */}
      <div>
        <p className="mb-2 text-sm font-medium text-neutral-400">
          Available Time (min)
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => adjustMinutes(-STEP)}
            disabled={loading || minutes <= MIN_MINUTES}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 text-white transition hover:bg-neutral-800 disabled:opacity-40"
            aria-label="Decrease 15 minutes"
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
            aria-label="Increase 15 minutes"
          >
            <Plus className="h-5 w-5 text-red-500" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Energy Level */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="energy" className="text-sm font-medium text-neutral-400">
            Energy Level
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
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || selectedMuscles.length === 0}
        className="mt-2 w-full rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? "Generating…"
          : selectedMuscles.length === 0
            ? "Select at least one muscle"
            : "Generate Workout"}
      </button>
    </form>
  );
}
