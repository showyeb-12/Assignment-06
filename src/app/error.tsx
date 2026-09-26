"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[fitlog] route error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <TriangleAlert className="size-10 text-danger" aria-hidden />
      <h1 className="mt-6 font-display text-3xl font-bold uppercase tracking-tight text-bone">
        Something broke mid-set
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-accent-ink transition-colors hover:bg-accent-dim"
      >
        <RotateCcw className="size-4" aria-hidden />
        Try again
      </button>
    </div>
  );
}
