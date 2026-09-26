const PREFIX = "fitlog";

/**
 * localStorage helpers. Every call is guarded because storage throws in
 * private-mode Safari and is simply absent during server rendering.
 */
export const storage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(`${PREFIX}:${key}`);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(`${PREFIX}:${key}`, JSON.stringify(value));
    } catch {
      /* quota exceeded or storage blocked — state stays in memory only */
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(`${PREFIX}:${key}`);
    } catch {
      /* ignore */
    }
  },
};
