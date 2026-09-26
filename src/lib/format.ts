import type { Workout } from "./types";

/** Workouts are displayed in uppercase display-font headings. */
export function toDisplayName(name: string): string {
  return name.toUpperCase();
}

export function formatDuration(minutes: number): string {
  return `${minutes} min`;
}

export function formatCalories(kcal: number): string {
  return `${kcal} kcal`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatSets(sets: number): string {
  return `${sets}`;
}

/** Summed session totals for the metrics row. */
export function summarise(workouts: Workout[]) {
  return workouts.reduce(
    (acc, w) => ({
      exercises: acc.exercises + 1,
      minutes: acc.minutes + w.duration,
      calories: acc.calories + w.caloriesBurned,
    }),
    { exercises: 0, minutes: 0, calories: 0 },
  );
}

/** Joins class names, dropping falsy values. */
export function cx(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(" ");
}
