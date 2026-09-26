"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { Workout } from "@/lib/types";
import { PLAN_LIMIT } from "@/lib/api";
import {
  getPlanState,
  getServerPlanState,
  planActions,
  subscribeToPlan,
} from "@/lib/planStore";
import { useToast } from "./ToastProvider";

interface PlanContextValue {
  plan: Workout[];
  saved: Workout[];
  doneIds: number[];
  hydrated: boolean;
  planCount: number;
  savedCount: number;
  isPlanned: (id: number) => boolean;
  isSaved: (id: number) => boolean;
  isDone: (id: number) => boolean;
  planIsFull: boolean;
  addToPlan: (workout: Workout) => void;
  removeFromPlan: (workout: Workout) => void;
  toggleSaved: (workout: Workout) => void;
  toggleDone: (workout: Workout) => void;
  clearPlan: () => void;
  /** Re-syncs stored records against the freshest API list. */
  reconcile: (workouts: Workout[]) => void;
}

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const { plan, saved, doneIds, hydrated } = useSyncExternalStore(
    subscribeToPlan,
    getPlanState,
    getServerPlanState,
  );
  const toast = useToast();

  const isPlanned = useCallback(
    (id: number) => plan.some((workout) => workout.id === id),
    [plan],
  );
  const isSaved = useCallback(
    (id: number) => saved.some((workout) => workout.id === id),
    [saved],
  );
  const isDone = useCallback((id: number) => doneIds.includes(id), [doneIds]);

  const addToPlan = useCallback(
    (workout: Workout) => {
      const current = getPlanState();

      if (current.plan.some((item) => item.id === workout.id)) {
        toast.info(`${workout.name} is already in today's plan`);
        return;
      }
      if (current.plan.length >= PLAN_LIMIT) {
        toast.error(`Plan is full — the cap is ${PLAN_LIMIT} lifts. Remove one first.`);
        return;
      }

      planActions.add(workout);
      toast.success(`Added ${workout.name} to today's plan`);
    },
    [toast],
  );

  const removeFromPlan = useCallback(
    (workout: Workout) => {
      planActions.removeFromPlan(workout);
      toast.info(`Removed ${workout.name} from today's plan`);
    },
    [toast],
  );

  const toggleSaved = useCallback(
    (workout: Workout) => {
      const wasSaved = getPlanState().saved.some((item) => item.id === workout.id);
      planActions.toggleSaved(workout);
      toast[wasSaved ? "info" : "success"](
        wasSaved
          ? `Removed ${workout.name} from saved`
          : `Saved ${workout.name} for later`,
      );
    },
    [toast],
  );

  const toggleDone = useCallback(
    (workout: Workout) => {
      const wasDone = getPlanState().doneIds.includes(workout.id);
      planActions.toggleDone(workout);
      toast.success(
        wasDone
          ? `${workout.name} moved back to your plan`
          : `${workout.name} marked as done — nice work`,
      );
    },
    [toast],
  );

  const clearPlan = useCallback(() => {
    planActions.clear();
    toast.info("Today's plan cleared");
  }, [toast]);

  const value = useMemo<PlanContextValue>(
    () => ({
      plan,
      saved,
      doneIds,
      hydrated,
      planCount: plan.length,
      savedCount: saved.length,
      isPlanned,
      isSaved,
      isDone,
      planIsFull: plan.length >= PLAN_LIMIT,
      addToPlan,
      removeFromPlan,
      toggleSaved,
      toggleDone,
      clearPlan,
      reconcile: planActions.reconcile,
    }),
    [
      plan,
      saved,
      doneIds,
      hydrated,
      isPlanned,
      isSaved,
      isDone,
      addToPlan,
      removeFromPlan,
      toggleSaved,
      toggleDone,
      clearPlan,
    ],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const context = useContext(PlanContext);
  if (!context) throw new Error("usePlan must be used inside <PlanProvider>");
  return context;
}
