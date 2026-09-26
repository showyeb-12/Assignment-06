/**
 * Shape of a workout record returned by the FitLog API.
 * Source: /api/fitlog (list) and /api/fitlog/:id (single).
 */
export interface Workout {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions: string[];
}

/** Sort modes offered by the "Sort By" dropdown. */
export type SortKey = "duration" | "calories" | "rating";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "duration", label: "Duration" },
  { value: "calories", label: "Calories" },
  { value: "rating", label: "Rating" },
];

/** Tabs on the My Plan page. */
export type PlanTab = "plan" | "saved";
