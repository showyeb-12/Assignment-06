import { LoadingSpinner } from "@/components/ui/Loading";

/** Fallback while the My Plan view mounts and the library request is in flight. */
export default function Loading() {
  return <LoadingSpinner label="Loading workouts…" className="min-h-[60vh]" />;
}
