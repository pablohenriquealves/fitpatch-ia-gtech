/** Skeleton do bloco "Foco do dia" durante o streaming. */
export function FocusSkeleton() {
  return (
    <div className="animate-pulse space-y-3" aria-hidden>
      <div className="h-3 w-24 rounded bg-neutral-800" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-neutral-800" />
        <div className="h-4 w-5/6 rounded bg-neutral-800" />
        <div className="h-4 w-3/4 rounded bg-neutral-800" />
      </div>
    </div>
  );
}

/** Placeholder de card no carrossel durante o streaming. */
export function ExerciseCardSkeleton() {
  return (
    <div
      className="w-[300px] shrink-0 animate-pulse rounded-xl border border-neutral-800 bg-neutral-900 p-4"
      aria-hidden
    >
      <div className="h-5 w-3/4 rounded bg-neutral-800" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-neutral-800" />
        <div className="h-3 w-5/6 rounded bg-neutral-800" />
        <div className="h-3 w-2/3 rounded bg-neutral-800" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="h-10 rounded-lg bg-neutral-950" />
        <div className="h-10 rounded-lg bg-neutral-950" />
      </div>
    </div>
  );
}
