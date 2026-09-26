import Link from "next/link";
import { ArrowLeft, Dumbbell, Home, Search } from "lucide-react";

/** Catches every unmatched route in the app. */
export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 size-[30rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:py-32">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.4em] text-accent">
          Error 404
        </p>

        <p className="mt-6 font-display text-[7rem] font-bold leading-none tracking-tighter text-bone tnum sm:text-[11rem]">
          404
        </p>

        <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.12em] text-bone sm:text-3xl">
          This set doesn&apos;t exist
        </h1>

        <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
          The page you&apos;re looking for was moved, deleted, or never logged in the first place.
          Head back to the library and pick a real lift.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-accent-ink transition-colors hover:bg-accent-dim"
          >
            <Home className="size-4" aria-hidden />
            Back to the library
          </Link>
          <Link
            href="/my-plan"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line-strong px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-bone transition-colors hover:border-accent hover:text-accent"
          >
            <Dumbbell className="size-4" aria-hidden />
            My Plan
          </Link>
        </div>

        <p className="mt-10 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-faint">
          <Search className="size-3.5" aria-hidden />
          Tip: every lift lives at /workouts/[id]
          <ArrowLeft className="size-3.5" aria-hidden />
        </p>
      </div>
    </div>
  );
}
