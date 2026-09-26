import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { LibraryBrowser } from "@/components/library/LibraryBrowser";

export const metadata: Metadata = {
  title: "Workout Library",
  description:
    "Twelve lifts covering every major muscle group. Browse the FitLog library, add a lift to today's plan, and log every set.",
  alternates: { canonical: "/" },
};

/**
 * The shell is static and ships with no build-time network dependency — the
 * library itself is fetched in the browser from /api/workouts, which is what
 * drives the visible loading state.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="library" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-bone sm:text-5xl">
                The <span className="text-accent">Library</span>
              </h2>
              <p className="mt-3 text-base text-muted">
                Twelve lifts covering every major muscle group.
              </p>
            </div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-faint">
              Pick a lift · Plan it · Log it
            </p>
          </div>

          <LibraryBrowser skeletonCount={12} />
        </div>
      </section>
    </>
  );
}
