import type { SortKey, Workout } from "./types";

/** Today's plan is capped so a session stays realistic. */
export const PLAN_LIMIT = 5;

const API_MIRRORS = [
  "https://api.api-store.workers.dev/api",
  "https://api.abcz.workers.dev/api",
] as const;

const REVALIDATE_SECONDS = 3600;

function normalise(raw: unknown): Workout | null {
  if (typeof raw !== "object" || raw === null) return null;
  const w = raw as Record<string, unknown>;

  /* Only a numeric id plus a name and a tag array are required. */
  if (typeof w.id !== "number" || typeof w.name !== "string" || !Array.isArray(w.muscleGroups)) {
    return null;
  }

  const str = (value: unknown, fallback: string) =>
    typeof value === "string" && value.trim().length > 0 ? value : fallback;
  const num = (value: unknown) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const strings = (value: unknown) =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

  return {
    id: w.id,
    name: w.name,
    image: str(w.image, ""),
    muscleGroups: strings(w.muscleGroups),
    equipment: str(w.equipment, "Bodyweight"),
    difficulty: str(w.difficulty, "Beginner"),
    duration: num(w.duration),
    caloriesBurned: num(w.caloriesBurned),
    sets: num(w.sets),
    reps: str(w.reps, "—"),
    rating: num(w.rating),
    description: str(w.description, ""),
    instructions: strings(w.instructions),
  };
}

/** Tries each mirror in order so one flaky host never breaks a page. */
async function request<T>(path: string, pick: (data: unknown) => T[]): Promise<T[]> {
  const errors: string[] = [];

  for (const base of API_MIRRORS) {
    try {
      const response = await fetch(`${base}${path}`, {
        next: { revalidate: REVALIDATE_SECONDS },
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        errors.push(`${base} -> HTTP ${response.status}`);
        continue;
      }

      const rows = pick(await response.json());
      if (rows.length) return rows;
      errors.push(`${base} -> empty payload`);
    } catch (error) {
      errors.push(`${base} -> ${(error as Error).message}`);
    }
  }

  console.error(`[fitlog] all mirrors failed for ${path}:`, errors.join(" | "));
  return [];
}

/** All twelve lifts, newest API shape first. */
export async function getWorkouts(): Promise<Workout[]> {
  const rows = await request<Workout>("/fitlog", (data) =>
    (Array.isArray(data) ? data : []).map(normalise).filter(Boolean) as Workout[],
  );
  return rows;
}

/** A single lift. Returns null when no mirror knows the id. */
export async function getWorkout(id: number): Promise<Workout | null> {
  const rows = await request<Workout>(`/fitlog/${id}`, (data) => {
    const single = normalise(data);
    return single ? [single] : [];
  });
  return rows[0] ?? null;
}

/* ------------------------------ pure helpers ------------------------------ */

/** Sorts a copy of the list; ties fall back to name for stable output. */
export function sortWorkouts(list: Workout[], key: SortKey): Workout[] {
  const value = (w: Workout) => {
    if (key === "calories") return w.caloriesBurned;
    if (key === "rating") return w.rating;
    return w.duration;
  };

  return [...list].sort((a, b) => {
    const diff = value(a) - value(b);
    return diff !== 0 ? diff : a.name.localeCompare(b.name);
  });
}

/** Case-insensitive match on workout name and muscle-group tags. */
export function filterWorkouts(list: Workout[], query: string): Workout[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;

  return list.filter((w) => {
    const tags = w.muscleGroups.join(" ").toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      tags.includes(q) ||
      w.equipment.toLowerCase().includes(q)
    );
  });
}
