import Link from "next/link";
import { ChevronRight, Dumbbell } from "lucide-react";
import type { Workout } from "@/lib/types";
import { cx, toDisplayName } from "@/lib/format";
import { StatsRow } from "@/components/ui/StatsRow";
import { TagList } from "@/components/ui/TagPill";
import { WorkoutImage } from "@/components/ui/WorkoutImage";

interface WorkoutCardProps {
  workout: Workout;
  className?: string;
}

/** Library tile — the whole card is the link to the detail page. */
export function WorkoutCard({ workout, className }: WorkoutCardProps) {
  return (
    <Link
      href={`/workouts/${workout.id}`}
      className={cx(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300",
        "hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_24px_50px_-24px_rgba(204,255,0,0.35)]",
        className,
      )}
    >
      <WorkoutImage
        src={workout.image}
        alt={`${workout.name} illustration`}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="aspect-[4/3] w-full"
        imageClassName="transition-transform duration-500 group-hover:scale-105"
      />

      {/* Difficulty flag */}
      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-ink/80 px-2 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-bone backdrop-blur-sm">
        <Dumbbell className="size-3 text-accent" aria-hidden />
        {workout.difficulty}
      </span>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <TagList tags={workout.muscleGroups} />

        <h3 className="font-display text-xl font-semibold uppercase leading-tight tracking-wide text-bone transition-colors group-hover:text-accent">
          {toDisplayName(workout.name)}
        </h3>

        <p className="flex items-center gap-1.5 text-sm text-faint">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-faint">
            Gear
          </span>
          <span className="truncate text-muted">{workout.equipment}</span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
          <StatsRow workout={workout} />
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-all group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
            <ChevronRight className="size-4" aria-hidden />
            <span className="sr-only">View details for {workout.name}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
