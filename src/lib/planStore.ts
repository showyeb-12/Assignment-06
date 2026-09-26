import type { Workout } from "./types";
import { storage } from "./storage";

/**
 * Plan / saved / done state lives in a tiny external store rather than in
 * component state, so it can be read during render (via `useSyncExternalStore`)
 * and restored from localStorage without a hydration mismatch.
 */
export interface PlanState {
  plan: Workout[];
  saved: Workout[];
  doneIds: number[];
  /** False during SSR and the first client render. */
  hydrated: boolean;
}

const EMPTY: PlanState = { plan: [], saved: [], doneIds: [], hydrated: false };

let state: PlanState = EMPTY;

const listeners = new Set<() => void>();

const KEYS = { plan: "plan", saved: "saved", done: "done" } as const;

function emit(next: PlanState) {
  state = next;
  listeners.forEach((listener) => listener());
}

function persist(next: PlanState) {
  storage.set(KEYS.plan, next.plan);
  storage.set(KEYS.saved, next.saved);
  storage.set(KEYS.done, next.doneIds);
}

/* --------------------------------- reads ---------------------------------- */

export function getPlanState(): PlanState {
  return state;
}

export function getServerPlanState(): PlanState {
  return EMPTY;
}

export function subscribeToPlan(listener: () => void): () => void {
  listeners.add(listener);
  /* First client subscription is the earliest safe moment to read storage. */
  hydrate();
  return () => {
    listeners.delete(listener);
  };
}

/** Restores the persisted collections exactly once. */
export function hydrate(): void {
  if (typeof window === "undefined" || state.hydrated) return;
  emit({
    plan: storage.get<Workout[]>(KEYS.plan, []),
    saved: storage.get<Workout[]>(KEYS.saved, []),
    doneIds: storage.get<number[]>(KEYS.done, []),
    hydrated: true,
  });
}

/* -------------------------------- writes --------------------------------- */

function update(mutate: (current: PlanState) => PlanState): void {
  const next = mutate(state);
  if (next === state) return;
  emit(next);
  persist(next);
}

export const planActions = {
  add(workout: Workout) {
    update((current) =>
      current.plan.some((item) => item.id === workout.id)
        ? current
        : {
            ...current,
            plan: [...current.plan, workout],
            doneIds: current.doneIds.filter((id) => id !== workout.id),
          },
    );
  },

  removeFromPlan(workout: Workout) {
    update((current) =>
      current.plan.some((item) => item.id === workout.id)
        ? {
            ...current,
            plan: current.plan.filter((item) => item.id !== workout.id),
            doneIds: current.doneIds.filter((id) => id !== workout.id),
          }
        : current,
    );
  },

  toggleSaved(workout: Workout) {
    update((current) => {
      const exists = current.saved.some((item) => item.id === workout.id);
      return {
        ...current,
        saved: exists
          ? current.saved.filter((item) => item.id !== workout.id)
          : [...current.saved, workout],
      };
    });
  },

  toggleDone(workout: Workout) {
    update((current) => {
      const isDone = current.doneIds.includes(workout.id);
      return {
        ...current,
        doneIds: isDone
          ? current.doneIds.filter((id) => id !== workout.id)
          : [...current.doneIds, workout.id],
      };
    });
  },

  clear() {
    update((current) =>
      current.plan.length === 0 && current.doneIds.length === 0
        ? current
        : { ...current, plan: [], doneIds: [] },
    );
  },

  /** Re-syncs stored records against a fresh API payload. */
  reconcile(workouts: Workout[]) {
    if (workouts.length === 0) return;

    const byId = new Map(workouts.map((workout) => [workout.id, workout]));
    const merge = (items: Workout[]) => {
      if (items.length === 0) return items;
      const next = items.flatMap((item) => {
        const fresh = byId.get(item.id);
        return fresh ? [fresh] : [];
      });
      const unchanged =
        next.length === items.length && next.every((item, index) => item === items[index]);
      return unchanged ? items : next;
    };

    update((current) => {
      const plan = merge(current.plan);
      const saved = merge(current.saved);
      return plan === current.plan && saved === current.saved
        ? current
        : { ...current, plan, saved };
    });
  },
};
