"use client";

import Link from "next/link";
import { Check, CheckCircle2, Eye, Plus, Trash2 } from "lucide-react";
import type { Workout } from "@/lib/types";
import { usePlan } from "@/components/providers/PlanProvider";
import { WorkoutImage } from "@/components/ui/WorkoutImage";
import { StatsRow } from "@/components/ui/StatsRow";
import { TagList } from "@/components/ui/TagPill";
import { cx, toDisplayName } from "@/lib/format";

interface PlanCardProps {
  workout: Workout;
  /** Today's Plan rows can be completed; Saved rows can be promoted. */
  mode: "plan" | "saved";
}

/** A row in the Today's Plan / Saved list. */
export function PlanCard({ workout, mode }: PlanCardProps) {
  const { isDone, isPlanned, addToPlan, removeFromPlan, toggleSaved, toggleDone, planIsFull } =
    usePlan();
  const done = isDone(workout.id);
  /** A saved lift can still be promoted unless the cap blocks it. */
  const blocked = mode === "saved" && planIsFull && !isPlanned(workout.id);

  return (
    <li
      className={cx(
        "group relative overflow-hidden rounded-2xl border bg-surface transition-colors",
        done ? "border-accent/40" : "border-line hover:border-line-strong",
      )}
    >
      {/* Completion rail */}
      <span
        aria-hidden
        className={cx(
          "absolute inset-y-0 left-0 w-1 transition-colors",
          done ? "bg-accent" : "bg-transparent",
        )}
      />

      <div className="flex flex-col gap-5 p-4 pl-5 sm:flex-row sm:items-center sm:gap-6 sm:p-5 sm:pl-6">
        {/* Thumbnail */}
        <WorkoutImage
          src={workout.image}
          alt={`${workout.name} thumbnail`}
          sizes="112px"
          className="h-32 w-full shrink-0 rounded-xl sm:size-28"
          imageClassName="transition-transform duration-500 group-hover:scale-105"
        />

        {/* Body */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {done && (
              <span className="inline-flex items-center gap-1 rounded-md bg-accent/15 px-2 py-0.5 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-accent">
                <CheckCircle2 className="size-3" aria-hidden />
                Done
              </span>
            )}
            <TagList tags={workout.muscleGroups} />
          </div>

          <h3
            className={cx(
              "mt-2 font-display text-xl font-semibold uppercase leading-tight tracking-wide sm:text-2xl",
              done ? "text-faint line-through decoration-accent/60" : "text-bone",
            )}
          >
            <Link
              href={`/workouts/${workout.id}`}
              className="transition-colors hover:text-accent focus-visible:text-accent"
            >
              {toDisplayName(workout.name)}
            </Link>
          </h3>

          <p className="mt-1 text-sm text-muted">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-faint">
              Gear
            </span>{" "}
            {workout.equipment}
          </p>

          <div className="mt-3 border-t border-line pt-3">
            <StatsRow workout={workout} size="md" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:w-56 sm:flex-col sm:items-stretch">
          <Link
            href={`/workouts/${workout.id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-line-strong px-4 py-2.5 text-sm font-semibold text-bone transition-colors hover:border-accent hover:text-accent"
          >
            <Eye className="size-4" aria-hidden />
            View Details
          </Link>

          {mode === "plan" ? (
            <button
              type="button"
              onClick={() => toggleDone(workout)}
              aria-pressed={done}
              className={cx(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                done
                  ? "border border-line-strong text-muted hover:border-accent hover:text-accent"
                  : "bg-accent text-accent-ink hover:bg-accent-dim",
              )}
            >
              {done ? <Check className="size-4" aria-hidden /> : <CheckCircle2 className="size-4" aria-hidden />}
              {done ? "Mark as Not Done" : "Mark as Done"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => addToPlan(workout)}
              disabled={blocked}
              aria-disabled={blocked}
              className={cx(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                blocked
                  ? "cursor-not-allowed bg-surface text-faint"
                  : "bg-accent text-accent-ink hover:bg-accent-dim",
              )}
            >
              <Plus className="size-4" aria-hidden />
              {blocked ? "Plan Full" : "Add to Plan"}
            </button>
          )}

          <button
            type="button"
            onClick={() => (mode === "plan" ? removeFromPlan(workout) : toggleSaved(workout))}
            aria-label={`Remove ${workout.name}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-line-strong px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-danger hover:border-danger/80 hover:text-danger"
          >
            <Trash2 className="size-4" aria-hidden />
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
