// Note: expired keys are evicted lazily (only on re-access), so the store can
// grow with unique keys until an instance restarts. On serverless this resets on
// cold start; for multi-instance enforcement upgrade to edge KV (see plan P2).
type Entry = { count: number; resetAt: number }
const store = new Map<string, Entry>()

export type RateLimitResult = { allowed: boolean; remaining: number; resetAt: number }

export function rateLimit(
  key: string,
  opts: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const limit = opts.limit ?? 15
  const windowMs = opts.windowMs ?? 60_000
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now >= entry.resetAt) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: limit - 1, resetAt }
  }
  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }
  entry.count += 1
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}

/** Test-only: clears the store between cases. */
export function __resetRateLimitStore(): void {
  store.clear()
}
