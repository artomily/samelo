/** Simple in-memory rate limiter for API routes (per-IP or per-wallet) */
const windowMs = 60_000 // 1 minute window
const requests = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(key: string, maxRequests: number): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = requests.get(key)

  if (!entry || now >= entry.resetAt) {
    requests.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt }
}

/** Clear a rate limit entry (for testing) */
export function clearRateLimit(key: string): void {
  requests.delete(key)
}
