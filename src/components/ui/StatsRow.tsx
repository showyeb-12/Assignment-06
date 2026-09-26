import { Clock, Flame, Star } from "lucide-react";
import type { Workout } from "@/lib/types";
import { cx } from "@/lib/format";

interface StatsRowProps {
  workout: Pick<Workout, "duration" | "caloriesBurned" | "rating">;
  className?: string;
  size?: "sm" | "md";
}

/** Duration / calories / rating trio with icons. */
export function StatsRow({ workout, className, size = "sm" }: StatsRowProps) {
  const icon = size === "sm" ? "size-3.5" : "size-4";
  const text = size === "sm" ? "text-xs" : "text-sm";

  return (
    <ul className={cx("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
      <li className={cx("flex items-center gap-1.5 text-muted", text)}>
        <Clock className={cx(icon, "text-faint")} aria-hidden />
        <span className="tnum">{workout.duration} min</span>
      </li>
      <li className={cx("flex items-center gap-1.5 text-muted", text)}>
        <Flame className={cx(icon, "text-faint")} aria-hidden />
        <span className="tnum">{workout.caloriesBurned} kcal</span>
      </li>
      <li className={cx("flex items-center gap-1.5 text-muted", text)}>
        <Star className={cx(icon, "fill-accent text-accent")} aria-hidden />
        <span className="tnum">{workout.rating.toFixed(1)}</span>
      </li>
    </ul>
  );
}
