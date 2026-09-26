import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";

const FOOTER_LINKS = [
  { href: "/", label: "Workout" },
  { href: "/my-plan", label: "My Plan" },
] as const;

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-ink-raised">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <LogoMark size="md" />
          <span className="flex flex-col">
            <span className="font-display text-lg font-bold leading-none tracking-[0.14em] text-bone">
              FITLOG
            </span>
            <span className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-faint">
              Workout Library
            </span>
          </span>
        </div>

        {/* Links (desktop only — the navbar already covers mobile) */}
        <nav aria-label="Footer" className="hidden items-center gap-6 md:flex">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-sm text-faint md:text-right">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}
