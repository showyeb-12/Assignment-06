"use client";

import { useMemo, useState } from "react";
import { RotateCcw, SearchX, TriangleAlert } from "lucide-react";
import type { SortKey, Workout } from "@/lib/types";
import { filterWorkouts, sortWorkouts } from "@/lib/api";
import { useWorkouts } from "@/lib/useWorkouts";
import { SearchBar } from "@/components/ui/SearchBar";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { LibrarySkeleton } from "@/components/ui/Loading";
import { WorkoutCard } from "./WorkoutCard";
import { cx, toDisplayName } from "@/lib/format";

export function LibraryBrowser({ skeletonCount = 12 }: { skeletonCount?: number }) {
  const { workouts, status, error, refresh } = useWorkouts();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("duration");

  const visible = useMemo(
    () => sortWorkouts(filterWorkouts(workouts, query), sortKey),
    [workouts, query, sortKey],
  );

  if (status === "loading") return <LibrarySkeleton count={skeletonCount} />;

  if (status === "error") {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-4 rounded-2xl border border-danger/30 bg-surface px-6 py-14 text-center"
      >
        <TriangleAlert className="size-8 text-danger" aria-hidden />
        <div>
          <p className="font-display text-lg font-semibold uppercase tracking-wide text-bone">
            Couldn&apos;t load the library
          </p>
          <p className="mt-1 text-sm text-muted">{error}</p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-4 py-2.5 text-sm font-semibold text-bone transition-colors hover:border-accent hover:text-accent"
        >
          <RotateCcw className="size-4" aria-hidden />
          Try again
        </button>
      </div>
    );
  }

  const searching = query.trim().length > 0;

  return (
    <div>
      {/* Ticker of every lift in the library */}
      {workouts.length > 0 && (
        <div
          aria-hidden
          className="mb-10 -mx-4 overflow-hidden border-y border-line bg-ink-raised py-3 sm:-mx-6 lg:-mx-8"
        >
          <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
            {[...workouts, ...workouts].map((workout, index) => (
              <span
                key={`${workout.id}-${index}`}
                className="flex items-center gap-8 font-mono text-xs uppercase tracking-[0.3em] text-faint"
              >
                {toDisplayName(workout.name)}
                <span className="size-1 rounded-full bg-accent" />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar: search + sort */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <SearchBar value={query} onChange={setQuery} resultCount={visible.length} />
          <SortDropdown value={sortKey} onChange={setSortKey} />
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint" aria-live="polite">
          {visible.length} {visible.length === 1 ? "lift" : "lifts"}
          {searching && " found"}
        </p>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <NoResults query={query} onClear={() => setQuery("")} />
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((workout: Workout) => (
            <li key={workout.id}>
              <WorkoutCard workout={workout} className="h-full" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NoResults({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div
      className={cx(
        "flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center",
      )}
    >
      <SearchX className="size-9 text-faint" aria-hidden />
      <div>
        <p className="font-display text-lg font-semibold uppercase tracking-[0.12em] text-bone">
          Nothing matches “{query.trim()}”
        </p>
        <p className="mt-1 text-sm text-muted">
          Try a different lift name, muscle group, or piece of equipment.
        </p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="rounded-xl border border-line-strong px-4 py-2.5 text-sm font-semibold text-bone transition-colors hover:border-accent hover:text-accent"
      >
        Clear search
      </button>
    </div>
  );
}
