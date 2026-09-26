"use client";

import { Bookmark, BookmarkCheck, Check, Plus, TriangleAlert } from "lucide-react";
import type { Workout } from "@/lib/types";
import { PLAN_LIMIT } from "@/lib/api";
import { usePlan } from "@/components/providers/PlanProvider";
import { cx } from "@/lib/format";

/** The two detail-page calls to action, wired to the plan + saved stores. */
export function DetailActions({ workout }: { workout: Workout }) {
  const { isPlanned, isSaved, planIsFull, planCount, addToPlan, toggleSaved } = usePlan();

  const planned = isPlanned(workout.id);
  const saved = isSaved(workout.id);
  const blocked = !planned && planIsFull;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => addToPlan(workout)}
          disabled={blocked}
          aria-disabled={blocked}
          className={cx(
            "group inline-flex flex-1 items-center justify-center gap-2.5 rounded-xl px-6 py-4 font-display text-base font-semibold uppercase tracking-[0.12em] transition-all",
            planned
              ? "border border-accent/60 bg-accent/10 text-accent"
              : blocked
                ? "cursor-not-allowed border border-line bg-surface text-faint"
                : "bg-accent text-accent-ink hover:bg-accent-dim hover:shadow-[0_18px_40px_-16px_rgba(204,255,0,0.6)]",
          )}
        >
          {planned ? (
            <Check className="size-5" aria-hidden />
          ) : blocked ? (
            <TriangleAlert className="size-5" aria-hidden />
          ) : (
            <Plus className="size-5" aria-hidden />
          )}
          {planned ? "In today’s plan" : "Add to today’s plan"}
        </button>

        <button
          type="button"
          onClick={() => toggleSaved(workout)}
          aria-pressed={saved}
          className={cx(
            "group inline-flex flex-1 items-center justify-center gap-2.5 rounded-xl border px-6 py-4 font-display text-base font-semibold uppercase tracking-[0.12em] transition-all",
            saved
              ? "border-accent/60 bg-accent/10 text-accent"
              : "border-line-strong text-bone hover:border-accent hover:text-accent",
          )}
        >
          {saved ? (
            <BookmarkCheck className="size-5" aria-hidden />
          ) : (
            <Bookmark className="size-5" aria-hidden />
          )}
          {saved ? "Saved for later" : "Save for later"}
        </button>
      </div>

      {/* Plan cap feedback */}
      <p
        aria-live="polite"
        className={cx(
          "flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em]",
          blocked ? "text-danger" : "text-faint",
        )}
      >
        {blocked
          ? `Today’s plan is full (${planCount}/${PLAN_LIMIT}) — remove a lift to add another.`
          : `Today’s plan: ${planCount}/${PLAN_LIMIT} lifts used.`}
      </p>
    </div>
  );
}
