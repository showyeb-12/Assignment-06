"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Dumbbell, Flame, Layers, Play } from "lucide-react";
import { useWorkouts } from "@/lib/useWorkouts";
import { WorkoutImage } from "@/components/ui/WorkoutImage";
import { toDisplayName } from "@/lib/format";

const MARKS = [
  { icon: Layers, label: "12 curated lifts" },
  { icon: Flame, label: "Every muscle group" },
  { icon: Dumbbell, label: "Plan, log, repeat" },
];

/**
 * Above-the-fold banner. The CTA is a plain in-page anchor to #library.
 *
 * The artwork is a real lift from the library so the hero stays in sync with
 * the data; `public/hero-banner.svg` covers the first paint and any failure.
 */
export function Hero() {
  const { workouts } = useWorkouts({ minLoadingMs: 0 });

  const featured = workouts.find((workout) => workout.id === 1) ?? workouts[0];

  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Ambient lime glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-32 size-[28rem] rounded-full bg-accent/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/3 size-96 rounded-full bg-accent/5 blur-[100px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-24">
        {/* Copy */}
        <div className="animate-fade-up">
          <p className="flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden />
            Workout Library
          </p>

          <h1 className="mt-6 font-display text-[2.6rem] font-bold uppercase leading-[0.95] tracking-tight text-bone sm:text-6xl lg:text-7xl">
            Train with intent.
            <br />
            <span className="text-accent">Log every set.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into
            today&apos;s plan, and watch the week&apos;s work add up.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#library"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-accent px-7 py-4 font-display text-base font-semibold uppercase tracking-[0.12em] text-accent-ink transition-all hover:bg-accent-dim hover:shadow-[0_18px_40px_-16px_rgba(204,255,0,0.6)]"
            >
              <Dumbbell className="size-5" aria-hidden />
              Browse Workouts
              <ArrowDown
                className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
                aria-hidden
              />
            </a>

            <Link
              href="/my-plan"
              className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-6 py-4 font-display text-base font-semibold uppercase tracking-[0.12em] text-bone transition-colors hover:border-accent hover:text-accent"
            >
              My Plan
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-line pt-7">
            {MARKS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-faint">
                <Icon className="size-4 text-accent" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Banner image */}
        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="relative overflow-hidden rounded-3xl border border-line-strong bg-surface">
            {featured ? (
              <WorkoutImage
                key={featured.image}
                src={featured.image}
                alt={`${featured.name} illustration`}
                sizes="(max-width: 1024px) 100vw, 45vw"
                preload
                className="aspect-[4/5] w-full animate-fade-up sm:aspect-[16/11] lg:aspect-[4/5]"
                imageClassName="object-cover"
              />
            ) : (
              <Image
                src="/hero-banner.svg"
                alt="Illustration of a loaded barbell ready for a session"
                fill
                unoptimized
                preload
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            )}

            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink via-ink/50 to-transparent"
            />

            {/* Caption strip */}
            {featured && (
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                <div className="min-w-0">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-accent">
                    Featured lift
                  </p>
                  <p className="mt-1 truncate font-display text-xl font-bold uppercase tracking-wide text-bone sm:text-2xl">
                    {toDisplayName(featured.name)}
                  </p>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
                  <Play className="size-4 translate-x-[1px]" aria-hidden />
                </span>
              </div>
            )}

            <span
              aria-hidden
              className="absolute inset-x-6 bottom-0 h-1 rounded-full bg-accent/80"
            />
          </div>

          {/* Floating feature card — a real lift, ready to plan */}
          {featured ? (
            <Link
              href={`/workouts/${featured.id}`}
              className="group absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl border border-line bg-ink-raised/95 p-3 pr-5 shadow-[0_20px_45px_-20px_rgba(0,0,0,0.9)] backdrop-blur transition-colors hover:border-accent sm:-left-6"
            >
              <WorkoutImage
                src={featured.image}
                alt=""
                sizes="64px"
                className="size-14 shrink-0 rounded-xl"
              />
              <span className="flex flex-col">
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-faint">
                  Start today
                </span>
                <span className="font-display text-lg font-bold uppercase leading-tight tracking-wide text-bone transition-colors group-hover:text-accent">
                  {featured.duration} min · {featured.caloriesBurned} kcal
                </span>
                <span className="text-xs text-muted">Tap for the full breakdown</span>
              </span>
            </Link>
          ) : (
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-line bg-ink-raised/95 px-5 py-3.5 shadow-[0_20px_45px_-20px_rgba(0,0,0,0.9)] backdrop-blur sm:left-8">
              <span className="font-display text-3xl font-bold leading-none text-accent tnum">
                12
              </span>
              <span className="font-mono text-[0.6rem] uppercase leading-tight tracking-[0.2em] text-muted">
                Lifts
                <br />
                in the library
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
