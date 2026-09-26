import type { Workout } from "@/lib/types";

/** Numbered step list for how to perform the lift. */
export function Instructions({ workout }: { workout: Workout }) {
  return (
    <section aria-labelledby="instructions-heading">
      <h2
        id="instructions-heading"
        className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-accent"
      >
        Instructions
      </h2>

      <ol className="mt-5 grid gap-3">
        {workout.instructions.map((step, index) => (
          <li
            key={step}
            className="group flex gap-4 rounded-2xl border border-line bg-surface/60 p-4 transition-colors hover:border-line-strong"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line-strong font-display text-base font-bold text-accent transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
              {index + 1}
            </span>
            <p className="pt-1.5 text-sm leading-relaxed text-muted sm:text-base">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
