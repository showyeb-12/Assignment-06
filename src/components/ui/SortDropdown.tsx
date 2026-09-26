"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { SORT_OPTIONS, type SortKey } from "@/lib/types";
import { cx } from "@/lib/format";

interface SortDropdownProps {
  value: SortKey;
  onChange: (value: SortKey) => void;
  className?: string;
  label?: string;
}

/** Custom listbox: "Sort By" with a chevron, three options, no native chrome. */
export function SortDropdown({
  value,
  onChange,
  className,
  label = "Sort By",
}: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const active = SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0];

  /* Dismiss on outside click or Escape. */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className={cx("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-2.5 text-left transition-colors hover:border-line-strong sm:w-auto"
      >
        <span className="flex flex-col leading-tight">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-faint">
            {label}
          </span>
          <span className="text-sm font-semibold text-bone">{active.label}</span>
        </span>
        <ChevronDown
          className={cx(
            "size-4 shrink-0 text-accent transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <ul
        id={listId}
        role="listbox"
        aria-label={label}
        hidden={!open}
        className="absolute right-0 z-30 mt-2 w-full min-w-44 animate-fade-up overflow-hidden rounded-xl border border-line bg-ink-raised p-1 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.95)] sm:w-48"
      >
        {SORT_OPTIONS.map((option) => {
          const selected = option.value === value;
          return (
            <li key={option.value} role="none">
              <button
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cx(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  selected
                    ? "bg-accent/10 font-semibold text-accent"
                    : "text-muted hover:bg-surface-hover hover:text-bone",
                )}
              >
                {option.label}
                {selected && <Check className="size-4" aria-hidden />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
