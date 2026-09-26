import { cx } from "@/lib/format";

/** Small uppercase outline pill used for muscle-group tags. */
export function TagPill({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "accent" | "muted";
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em]",
        tone === "accent" && "border-accent/50 bg-accent/10 text-accent",
        tone === "muted" && "border-line bg-surface text-faint",
        tone === "default" && "border-line-strong text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Group of muscle-group tags. */
export function TagList({
  tags,
  tone,
  className,
}: {
  tags: string[];
  tone?: "default" | "accent";
  className?: string;
}) {
  return (
    <ul className={cx("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag) => (
        <li key={tag}>
          <TagPill tone={tone}>{tag}</TagPill>
        </li>
      ))}
    </ul>
  );
}
