import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, Dumbbell } from "lucide-react";
import { AuthForm } from "./components/AuthForm.js";
import { CheckInForm } from "./components/CheckInForm.js";
import { ExerciseCard } from "./components/ExerciseCard.js";
import {
  ExerciseCardSkeleton,
  FocusSkeleton,
} from "./components/WorkoutSkeletons.js";
import { parseAdaptedWorkoutText } from "./utils/parseWorkoutText.js";
import { streamWorkoutGeneration } from "./services/workoutStream.js";
import type { WorkoutCheckInRequest } from "./types/workout.js";

type Screen = "auth" | "form" | "workout";

export default function App() {
  const [screen, setScreen] = useState<Screen>("auth");
  const [streamedText, setStreamedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedWorkout = useMemo(
    () => parseAdaptedWorkoutText(streamedText),
    [streamedText],
  );

  const showFocusSkeleton = loading && !parsedWorkout.focus.trim();
  const showExerciseSkeletons = loading && parsedWorkout.exercises.length === 0;

  const runGeneration = useCallback((payload: WorkoutCheckInRequest) => {
    setError(null);
    setStreamedText("");
    setLoading(true);
    setScreen("workout");

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setLoading(false);
    };

    void streamWorkoutGeneration(payload, {
      onTextChunk: (text) => {
        setStreamedText((prev) => prev + text);
      },
      onDone: () => {
        finish();
      },
      onError: (message) => {
        setError(message);
        finish();
      },
    }).catch((e: unknown) => {
      setError(
        e instanceof Error ? e.message : "Falha ao conectar ao servidor.",
      );
      finish();
    });
  }, []);

  const backToForm = () => {
    setScreen("form");
    setStreamedText("");
    setError(null);
    setLoading(false);
  };

  const finalizeWorkout = () => {
    backToForm();
  };

  const handleAuthSuccess = () => {
    setScreen("form");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800 bg-neutral-950/90 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <Dumbbell className="h-8 w-8 text-red-500" strokeWidth={2} />
          <div>
            <h1 className="text-lg font-bold tracking-tight">FitPatch IA</h1>
            <p className="text-xs text-neutral-400">
              Treino adaptado ao seu dia
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        {screen === "auth" && <AuthForm onAuthSuccess={handleAuthSuccess} />}

        {screen === "form" && (
          <CheckInForm onSubmit={runGeneration} loading={loading} />
        )}

        {screen === "workout" && (
          <div className="flex flex-col gap-5">
            <button
              type="button"
              onClick={backToForm}
              className="inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-red-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Novo check-in
            </button>

            {error && (
              <div
                className="rounded-xl border border-red-900/80 bg-red-950/40 px-4 py-3 text-sm text-red-200"
                role="alert"
              >
                {error}
              </div>
            )}

            <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-red-500">
                Foco do dia
              </h2>
              <div className="mt-2">
                {showFocusSkeleton ? (
                  <FocusSkeleton />
                ) : (
                  <p className="text-sm leading-relaxed text-white">
                    {parsedWorkout.focus.trim() || "—"}
                  </p>
                )}
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-neutral-400">
                Exercícios
              </h2>

              <div className="-mx-4 overflow-x-auto px-4 pb-1 scrollbar-hide">
                <div className="flex flex-row gap-4">
                  {parsedWorkout.exercises.map((ex) => (
                    <ExerciseCard key={ex.id} exercise={ex} />
                  ))}
                  {showExerciseSkeletons &&
                    [0, 1, 2].map((i) => (
                      <ExerciseCardSkeleton key={`sk-${i}`} />
                    ))}
                </div>
              </div>

              <button
                type="button"
                onClick={finalizeWorkout}
                className="w-full rounded-xl bg-red-600 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-red-500"
              >
                Finalizar treino
              </button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
