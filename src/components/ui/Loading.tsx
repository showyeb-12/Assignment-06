import { cx } from "@/lib/format";

/** Pulsing bar used while the library or plan list is being fetched. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cx("animate-shimmer rounded-lg bg-surface-hover", className)}
      aria-hidden
    />
  );
}

/** Placeholder matching the shape of a library card. */
export function WorkoutCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-14" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <div className="flex gap-4 border-t border-line pt-3">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-10" />
        </div>
      </div>
    </div>
  );
}

/** Full library grid of skeletons — 12 cells, matching the real layout. */
export function LibrarySkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading workouts"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }, (_, index) => (
        <WorkoutCardSkeleton key={index} />
      ))}
      <span className="sr-only">Loading workouts…</span>
    </div>
  );
}

/** Centred spinner with a label, used for route-level loading states. */
export function LoadingSpinner({
  label = "Loading workouts…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cx("flex flex-col items-center justify-center gap-4 py-16", className)}
    >
      <span className="relative grid size-12 place-items-center" aria-hidden>
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-line" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent [animation-duration:0.7s]" />
      </span>
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">{label}</p>
    </div>
  );
}
