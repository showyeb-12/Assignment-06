import Link from "next/link";
import type { Workout } from "@/lib/types";
import { WorkoutCard } from "@/components/library/WorkoutCard";

/**
 * Streamed in after the main content: "more lifts" is a nice-to-have and must
 * never delay the detail page itself.
 */
export async function RelatedLifts({
  source,
  excludeId,
}: {
  source: Promise<Workout[]>;
  excludeId: number;
}) {
  const related = (await source)
    .filter((workout) => workout.id !== excludeId)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-line bg-ink-raised/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-bone sm:text-3xl">
              More <span className="text-accent">lifts</span>
            </h2>
            <p className="mt-2 text-sm text-muted">
              Keep the session moving with these top-rated picks.
            </p>
          </div>
          <Link
            href="/"
            className="hidden shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted transition-colors hover:text-accent sm:block"
          >
            View all
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((workout) => (
            <li key={workout.id}>
              <WorkoutCard workout={workout} className="h-full" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
