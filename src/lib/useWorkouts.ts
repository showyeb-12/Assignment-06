"use client";

import { useCallback, useEffect, useState } from "react";
import type { Workout } from "./types";
import { usePlan } from "@/components/providers/PlanProvider";

type Status = "loading" | "ready" | "error";

interface WorkoutsState {
  workouts: Workout[];
  status: Status;
  error: string | null;
  refresh: () => void;
}

/**
 * Minimum time the skeleton stays on screen. Without it a warm cache would
 * paint the grid instantly and the loading animation would never be seen.
 */
const MIN_VISIBLE_LOADING_MS = 650;

/**
 * Loads the library in the browser so the loading state is a real, observable
 * part of the UX rather than a build-time artifact.
 */
export function useWorkouts(): WorkoutsState {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const { reconcile } = usePlan();

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    (async () => {
      setStatus("loading");
      setError(null);

      try {
        const response = await fetch("/api/workouts", { cache: "no-store" });
        if (!response.ok) throw new Error(`Request failed (HTTP ${response.status})`);

        const data: unknown = await response.json();
        if (!Array.isArray(data)) throw new Error("Unexpected response shape");

        const delay = Math.max(0, MIN_VISIBLE_LOADING_MS - (Date.now() - startedAt));
        window.setTimeout(() => {
          if (cancelled) return;
          setWorkouts(data as Workout[]);
          setStatus("ready");
        }, delay);
      } catch (caught) {
        if (cancelled) return;
        setError(caught instanceof Error ? caught.message : "Something went wrong");
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  /* Keep previously saved/plan records in step with the freshest payload. */
  useEffect(() => {
    if (status === "ready") reconcile(workouts);
  }, [status, workouts, reconcile]);

  const refresh = useCallback(() => setAttempt((n) => n + 1), []);

  return { workouts, status, error, refresh };
}
