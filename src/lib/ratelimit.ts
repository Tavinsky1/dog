const hits = new Map<string, { count: number; resetAt: number }>();

/** Allow `limit` requests per `windowMs` per key (default key = IP). */
export function allow({ key, limit = 20, windowMs = 60_000 }: { key: string; limit?: number; windowMs?: number }) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (entry.count >= limit) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count += 1;
  return { ok: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}
