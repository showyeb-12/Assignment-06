"use client";

import Image from "next/image";
import { useState } from "react";
import { cx } from "@/lib/format";

interface WorkoutImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  /** Eagerly load hero imagery that is above the fold. */
  preload?: boolean;
}

/**
 * `next/image` with a graceful fallback: if the remote CDN is unreachable the
 * card still renders a branded illustration instead of a broken image icon.
 */
export function WorkoutImage({
  src,
  alt,
  sizes,
  className,
  imageClassName,
  priority,
  preload,
}: WorkoutImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <FallbackIllustration className={className} label={alt} />;
  }

  return (
    <div className={cx("relative overflow-hidden bg-surface", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={cx("object-cover", imageClassName)}
        priority={priority}
        preload={preload}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

/** Local, dependency-free placeholder shown when an image cannot load. */
function FallbackIllustration({ className, label }: { className?: string; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cx(
        "grid place-items-center bg-[radial-gradient(circle_at_30%_20%,#242429,#101013_70%)]",
        className,
      )}
    >
      <svg viewBox="0 0 64 64" className="size-1/3 text-line-strong" fill="none" aria-hidden>
        <rect x="4" y="26" width="7" height="12" rx="2" fill="currentColor" />
        <rect x="53" y="26" width="7" height="12" rx="2" fill="currentColor" />
        <rect x="12" y="29" width="5" height="6" rx="1.5" fill="currentColor" />
        <rect x="47" y="29" width="5" height="6" rx="1.5" fill="currentColor" />
        <rect x="18" y="30" width="28" height="4" rx="2" fill="currentColor" />
      </svg>
    </div>
  );
}
