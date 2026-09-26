"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Bookmark, ClipboardList, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { usePlan } from "@/components/providers/PlanProvider";
import { cx } from "@/lib/format";

const LINKS = [
  { href: "/", label: "Workout" },
  { href: "/my-plan", label: "My Plan" },
] as const;

function CountBadge({
  count,
  tone,
}: {
  count: number;
  tone: "filled" | "outline";
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs font-semibold tnum transition-colors",
        tone === "filled"
          ? "bg-accent text-accent-ink"
          : "border border-line-strong text-muted hover:border-accent hover:text-accent",
      )}
    >
      {tone === "filled" ? (
        <ClipboardList className="size-3.5" aria-hidden />
      ) : (
        <Bookmark className="size-3.5" aria-hidden />
      )}
      <span className="sr-only">{tone === "filled" ? "Plan items:" : "Saved items:"}</span>
      <span aria-hidden>{count}</span>
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { planCount, savedCount, hydrated } = usePlan();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Solidify the bar once the hero starts leaving the viewport. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll while the drawer is open. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/" || pathname.startsWith("/workouts")
      : pathname.startsWith(href);

  /** The drawer closes on tap, not on a pathname-watching effect. */
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const counts = hydrated ? { plan: planCount, saved: savedCount } : { plan: 0, saved: 0 };

  return (
    <header
      className={cx(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-line bg-ink/85 backdrop-blur-xl"
          : "border-transparent bg-ink/40 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 lg:h-[72px] lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        {/* Brand — left */}
        <Link href="/" aria-label="FitLog home" className="justify-self-start">
          <Logo size="md" />
        </Link>

        {/* Primary nav — centre on desktop */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1 rounded-full border border-line bg-surface/60 p-1">
            {LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "block rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-[0.12em] transition-colors",
                      active
                        ? "bg-accent text-accent-ink"
                        : "text-muted hover:bg-surface-hover hover:text-bone",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Badges — right on desktop */}
        <div className="hidden items-center justify-self-end gap-2 lg:flex">
          <Link
            href="/my-plan"
            className="rounded-full transition-transform hover:scale-[1.03]"
            title="Open today's plan"
          >
            <CountBadge count={counts.plan} tone="filled" />
          </Link>
          <Link
            href="/my-plan"
            className="rounded-full transition-transform hover:scale-[1.03]"
            title="Open saved lifts"
          >
            <CountBadge count={counts.saved} tone="outline" />
          </Link>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="grid size-10 place-items-center rounded-lg border border-line text-bone transition-colors hover:border-line-strong lg:hidden"
        >
          {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className="border-t border-line bg-ink-raised/98 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Mobile" className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <ul className="grid gap-2">
            {LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMenu}
                    className={cx(
                      "flex items-center justify-between rounded-xl border px-4 py-3.5 text-base font-semibold uppercase tracking-[0.12em] transition-colors",
                      active
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-line text-muted hover:text-bone",
                    )}
                  >
                    {link.label}
                    {active && <span className="size-1.5 rounded-full bg-accent" aria-hidden />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
            <Link href="/my-plan" onClick={closeMenu} className="flex-1">
              <CountBadge count={counts.plan} tone="filled" />
            </Link>
            <Link href="/my-plan" onClick={closeMenu} className="flex-1">
              <CountBadge count={counts.saved} tone="outline" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
