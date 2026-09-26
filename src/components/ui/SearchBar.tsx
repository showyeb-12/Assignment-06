"use client";

import { Search, X } from "lucide-react";
import { cx } from "@/lib/format";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Announced result count for screen readers. */
  resultCount?: number;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search by name or tag…",
  className,
  resultCount,
}: SearchBarProps) {
  return (
    <div className={cx("relative w-full sm:max-w-xs", className)}>
      <label htmlFor="workout-search" className="sr-only">
        Search workouts
      </label>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint"
        aria-hidden
      />
      <input
        id="workout-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        aria-describedby={resultCount === undefined ? undefined : "workout-search-count"}
        className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-10 text-sm text-bone placeholder:text-faint transition-colors hover:border-line-strong focus:border-accent focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-faint transition-colors hover:bg-surface-hover hover:text-bone"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
      {resultCount !== undefined && (
        <p id="workout-search-count" className="sr-only" aria-live="polite">
          {resultCount} results
        </p>
      )}
    </div>
  );
}
