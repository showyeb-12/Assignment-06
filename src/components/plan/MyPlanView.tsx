"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, ClipboardList, Dumbbell, Flame, Timer } from "lucide-react";
import type { PlanTab, SortKey, Workout } from "@/lib/types";
import { filterWorkouts, PLAN_LIMIT, sortWorkouts } from "@/lib/api";
import { usePlan } from "@/components/providers/PlanProvider";
import { useWorkouts } from "@/lib/useWorkouts";
import { SearchBar } from "@/components/ui/SearchBar";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { LoadingSpinner } from "@/components/ui/Loading";
import { PlanCard } from "./PlanCard";
import { cx } from "@/lib/format";

const TABS: { id: PlanTab; label: string; icon: typeof ClipboardList }[] = [
  { id: "plan", label: "Today’s Plan", icon: ClipboardList },
  { id: "saved", label: "Saved", icon: Bookmark },
];

export function MyPlanView() {
  const { plan, saved, planIsFull, clearPlan, hydrated } = usePlan();
  const { status, error, refresh } = useWorkouts();

  const [tab, setTab] = useState<PlanTab>("plan");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("duration");

  const items: Workout[] = tab === "plan" ? plan : saved;

  const visible = useMemo(
    () => sortWorkouts(filterWorkouts(items, query), sortKey),
    [items, query, sortKey],
  );

  /* Metrics always reflect Today's Plan, whatever tab is open. */
  const metrics = useMemo(
    () =>
      plan.reduce(
        (acc, item) => ({
          exercises: acc.exercises + 1,
          minutes: acc.minutes + item.duration,
          calories: acc.calories + item.caloriesBurned,
        }),
        { exercises: 0, minutes: 0, calories: 0 },
      ),
    [plan],
  );

  const loading = status === "loading" || !hydrated;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {/* Header */}
      <header className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden />
            Session Log
          </p>
          <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-bone sm:text-6xl">
            My <span className="text-accent">Plan</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Cap of five lifts for today. Finish them, then load more.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {plan.length > 0 && (
            <button
              type="button"
              onClick={clearPlan}
              className="rounded-xl border border-line-strong px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted transition-colors hover:border-danger hover:text-danger"
            >
              Clear plan
            </button>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-accent-ink transition-colors hover:bg-accent-dim"
          >
            <Dumbbell className="size-4" aria-hidden />
            Browse workouts
          </Link>
        </div>
      </header>

      {/* Metrics */}
      <section aria-label="Today's session totals" className="mt-8">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            icon={ClipboardList}
            label="Exercises"
            value={metrics.exercises}
            suffix={metrics.exercises === 1 ? "lift" : "lifts"}
            accent
          />
          <MetricCard icon={Timer} label="Minutes" value={metrics.minutes} suffix="min" />
          <MetricCard icon={Flame} label="Calories" value={metrics.calories} suffix="kcal" />
        </ul>
      </section>

      {/* Tabs */}
      <div className="mt-10 flex flex-col gap-4 border-b border-line pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label="Plan sections"
          className="flex gap-1 rounded-full border border-line bg-surface/60 p-1"
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            const count = id === "plan" ? plan.length : saved.length;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={active}
                aria-controls={`panel-${id}`}
                onClick={() => setTab(id)}
                className={cx(
                  "inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] transition-colors sm:flex-none sm:px-6",
                  active ? "bg-accent text-accent-ink" : "text-muted hover:text-bone",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
                <span
                  className={cx(
                    "rounded-full px-1.5 py-0.5 font-mono text-[0.6rem] tnum",
                    active ? "bg-accent-ink/20 text-accent-ink" : "bg-surface-hover text-faint",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {!loading && items.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder={`Search ${tab === "plan" ? "your plan" : "saved"}…`}
              resultCount={visible.length}
            />
            <SortDropdown value={sortKey} onChange={setSortKey} label="Sort Plan By" />
          </div>
        )}
      </div>

      {/* Panel */}
      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="mt-8"
      >
        {loading ? (
          <LoadingSpinner label="Loading workouts…" />
        ) : status === "error" ? (
          <LoadError message={error} onRetry={refresh} />
        ) : visible.length === 0 ? (
          <EmptyState
            tab={tab}
            hasQuery={query.trim().length > 0}
            onClear={() => setQuery("")}
            planIsFull={planIsFull}
            planCount={plan.length}
          />
        ) : (
          <ul className="grid gap-4">
            {visible.map((workout) => (
              <PlanCard key={`${tab}-${workout.id}`} workout={workout} mode={tab} />
            ))}
          </ul>
        )}
      </div>

      {/* Plan cap note */}
      {!loading && plan.length > 0 && (
        <p className="mt-6 text-center font-mono text-[0.65rem] uppercase tracking-[0.25em] text-faint">
          {plan.length} of {PLAN_LIMIT} lifts used today
        </p>
      )}
    </div>
  );
}

/* ------------------------------- sub-parts -------------------------------- */

function MetricCard({
  icon: Icon,
  label,
  value,
  suffix,
  accent,
}: {
  icon: typeof ClipboardList;
  label: string;
  value: number;
  suffix: string;
  accent?: boolean;
}) {
  return (
    <li
      className={cx(
        "flex items-center gap-4 rounded-2xl border p-5 transition-colors",
        accent ? "border-accent/40 bg-accent/5" : "border-line bg-surface",
      )}
    >
      <span
        className={cx(
          "grid size-11 shrink-0 place-items-center rounded-xl",
          accent ? "bg-accent text-accent-ink" : "bg-surface-hover text-accent",
        )}
        aria-hidden
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-faint">{label}</p>
        <p className="mt-0.5 flex items-baseline gap-1.5">
          <span className="font-display text-3xl font-bold leading-none text-bone tnum">
            {value}
          </span>
          <span className="text-sm text-faint">{suffix}</span>
        </p>
      </div>
    </li>
  );
}

function EmptyState({
  tab,
  hasQuery,
  onClear,
  planIsFull,
  planCount,
}: {
  tab: PlanTab;
  hasQuery: boolean;
  onClear: () => void;
  planIsFull: boolean;
  planCount: number;
}) {
  if (hasQuery) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
        <p className="font-display text-lg font-semibold uppercase tracking-[0.12em] text-bone">
          No lifts match that search
        </p>
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

  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-line-strong px-6 py-20 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-surface text-accent" aria-hidden>
        {tab === "plan" ? <ClipboardList className="size-6" /> : <Bookmark className="size-6" />}
      </span>
      <div className="max-w-md">
        <h2 className="font-display text-2xl font-bold uppercase tracking-[0.1em] text-bone">
          Nothing here yet
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Browse the library and add a lift to get today moving.
        </p>
        {tab === "plan" && planIsFull && (
          <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-danger">
            Cap reached — {planCount} of {PLAN_LIMIT} lifts planned
          </p>
        )}
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-accent-ink transition-colors hover:bg-accent-dim"
      >
        <Dumbbell className="size-4" aria-hidden />
        Go to workouts
      </Link>
    </div>
  );
}

function LoadError({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-2xl border border-danger/30 bg-surface px-6 py-16 text-center"
    >
      <p className="font-display text-lg font-semibold uppercase tracking-wide text-bone">
        Couldn&apos;t load your lifts
      </p>
      <p className="text-sm text-muted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-xl border border-line-strong px-4 py-2.5 text-sm font-semibold text-bone transition-colors hover:border-accent hover:text-accent"
      >
        Try again
      </button>
    </div>
  );
}
