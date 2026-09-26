import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Flame, Star } from "lucide-react";
import { getWorkout, getWorkouts } from "@/lib/api";
import { toDisplayName } from "@/lib/format";
import { WorkoutImage } from "@/components/ui/WorkoutImage";
import { TagList } from "@/components/ui/TagPill";
import { SpecTable } from "@/components/detail/SpecTable";
import { Instructions } from "@/components/detail/Instructions";
import { DetailActions } from "@/components/detail/DetailActions";
import { RelatedLifts } from "@/components/detail/RelatedLifts";
import { WorkoutCardSkeleton } from "@/components/ui/Loading";

export const revalidate = 3600;

interface WorkoutPageProps {
  params: Promise<{ id: string }>;
}

/** Rejects anything that is not a positive integer id. */
function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({ params }: WorkoutPageProps): Promise<Metadata> {
  const { id } = await params;
  const workoutId = parseId(id);
  if (workoutId === null) return { title: "Lift not found" };

  const workout = await getWorkout(workoutId);
  if (!workout) return { title: "Lift not found" };

  return {
    title: workout.name,
    description: workout.description,
    alternates: { canonical: `/workouts/${workout.id}` },
    openGraph: {
      title: `${toDisplayName(workout.name)} | FitLog`,
      description: workout.description,
      images: workout.image ? [{ url: workout.image }] : undefined,
    },
  };
}

export default async function WorkoutDetailPage({ params }: WorkoutPageProps) {
  const { id } = await params;
  const workoutId = parseId(id);

  /* notFound() runs before the document is flushed, so unknown ids return a
     real HTTP 404 rather than a soft one. */
  if (workoutId === null) notFound();

  const workout = await getWorkout(workoutId);
  if (!workout) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Exercise",
    name: toDisplayName(workout.name),
    description: workout.description,
    image: workout.image,
    exerciseType: workout.muscleGroups.join(", "),
    equipment: workout.equipment,
    instructionalProperty: workout.instructions.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text,
    })),
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-faint transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to the library
        </Link>
      </div>

      <article className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:px-8 lg:py-10">
        {/* Left — visual */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface">
            <WorkoutImage
              src={workout.image}
              alt={`${workout.name} illustration`}
              sizes="(max-width: 1024px) 100vw, 50vw"
              preload
              className="aspect-[4/3] w-full"
            />
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink via-ink/40 to-transparent"
            />
            <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
              <TagList tags={workout.muscleGroups} tone="accent" />
            </div>
          </div>

          <ul className="mt-4 grid grid-cols-3 gap-3">
            {[
              { icon: Clock, value: `${workout.duration} min`, label: "Duration" },
              { icon: Flame, value: `${workout.caloriesBurned} kcal`, label: "Calories" },
              { icon: Star, value: workout.rating.toFixed(1), label: "Rating" },
            ].map(({ icon: Icon, value, label }) => (
              <li
                key={label}
                className="rounded-2xl border border-line bg-surface/60 px-3 py-4 text-center"
              >
                <Icon
                  className={`mx-auto size-4 ${label === "Rating" ? "fill-accent text-accent" : "text-faint"}`}
                  aria-hidden
                />
                <p className="mt-2 font-display text-lg font-bold text-bone tnum">{value}</p>
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-faint">
                  {label}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — content */}
        <div className="flex flex-col gap-9">
          <header>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-accent">
              {workout.difficulty} · {workout.sets} sets · reps {workout.reps}
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-bone sm:text-5xl">
              {toDisplayName(workout.name)}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              {workout.description}
            </p>
          </header>

          <DetailActions workout={workout} />

          <SpecTable workout={workout} />

          <Instructions workout={workout} />
        </div>
      </article>

      {/* More lifts — streamed so it never blocks the detail content */}
      <Suspense
        fallback={
          <section className="border-t border-line bg-ink-raised/40">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((index) => (
                  <li key={index}>
                    <WorkoutCardSkeleton />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        }
      >
        <RelatedLifts source={getWorkouts()} excludeId={workout.id} />
      </Suspense>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
