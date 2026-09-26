import type { Workout } from "@/lib/types";
import { formatCalories, formatDuration, formatRating } from "@/lib/format";

/** Label / value spec table shown on the detail page. */
export function SpecTable({ workout }: { workout: Workout }) {
  const specs: { label: string; value: string }[] = [
    { label: "Equipment", value: workout.equipment },
    { label: "Difficulty", value: workout.difficulty },
    { label: "Sets", value: String(workout.sets) },
    { label: "Reps", value: workout.reps },
    { label: "Duration", value: formatDuration(workout.duration) },
    { label: "Calories", value: formatCalories(workout.caloriesBurned) },
    { label: "Rating", value: formatRating(workout.rating) },
  ];

  return (
    <section aria-labelledby="specs-heading">
      <h2
        id="specs-heading"
        className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-accent"
      >
        Key Specs
      </h2>

      <dl className="mt-4 overflow-hidden rounded-2xl border border-line">
        {specs.map(({ label, value }, index) => (
          <div
            key={label}
            className={`grid grid-cols-[minmax(0,0.85fr)_1.15fr] items-center gap-4 px-4 py-3.5 sm:px-5 ${
              index > 0 ? "border-t border-line" : ""
            } ${index % 2 === 1 ? "bg-surface/60" : ""}`}
          >
            <dt className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-faint">
              {label}
            </dt>
            <dd className="text-sm font-semibold text-bone tnum sm:text-base">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
