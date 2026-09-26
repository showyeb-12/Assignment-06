import { NextResponse } from "next/server";
import { getWorkouts } from "@/lib/api";

/**
 * Same-origin proxy in front of the upstream FitLog API.
 *
 * The browser never talks to the third-party host directly, so a rate limit
 * (HTTP 429) or an outage upstream cannot break the UI — the response is cached
 * for an hour and both API mirrors are tried before giving up.
 */
export const revalidate = 3600;

export async function GET() {
  const workouts = await getWorkouts();

  if (workouts.length === 0) {
    return NextResponse.json(
      { error: "Workout data is temporarily unavailable" },
      { status: 503 },
    );
  }

  return NextResponse.json(workouts, {
    headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
