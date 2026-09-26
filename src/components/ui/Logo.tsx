import { cx } from "@/lib/format";

interface LogoProps {
  /** `mark` is the icon alone, `full` pairs it with the wordmark. */
  variant?: "full" | "mark";
  className?: string;
  /** Wordmark sizing follows the display font. */
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { box: "size-7", text: "text-base" },
  md: { box: "size-9", text: "text-xl" },
  lg: { box: "size-11", text: "text-2xl" },
} as const;

/** Bar-bell mark: two plates on a bar with a lime centre grip. */
export function LogoMark({ className, size = "md" }: Omit<LogoProps, "variant">) {
  return (
    <span
      className={cx(
        "grid shrink-0 place-items-center rounded-lg bg-accent text-accent-ink",
        SIZES[size].box,
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[62%]">
        <rect x="1.5" y="9" width="3.5" height="6" rx="1.2" fill="currentColor" />
        <rect x="19" y="9" width="3.5" height="6" rx="1.2" fill="currentColor" />
        <rect x="5.5" y="10.75" width="2.5" height="2.5" rx="0.8" fill="currentColor" />
        <rect x="16" y="10.75" width="2.5" height="2.5" rx="0.8" fill="currentColor" />
        <rect x="8.75" y="11.25" width="6.5" height="1.5" rx="0.75" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Logo({ variant = "full", className, size = "md" }: LogoProps) {
  if (variant === "mark") return <LogoMark className={className} size={size} />;

  return (
    <span className={cx("flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      <span
        className={cx(
          "font-display font-bold leading-none tracking-[0.14em] text-bone",
          SIZES[size].text,
        )}
      >
        FITLOG
      </span>
    </span>
  );
}
