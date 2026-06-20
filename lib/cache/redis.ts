const CACHE_TTL_SECONDS = {
  leaderboard: 60,
  stats: 30,
  video: 300,
  profile: 120,
  trending: 120,
} as const

export type CacheKey = keyof typeof CACHE_TTL_SECONDS

const inMemoryCache = new Map<string, { data: unknown; expiresAt: number }>()

export function getCached<T>(key: string): T | null {
  const entry = inMemoryCache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    inMemoryCache.delete(key)
    return null
  }
  return entry.data as T
}

export function setCached<T>(key: string, data: T, ttlSeconds: number): void {
  inMemoryCache.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 })
}

export function invalidateCache(prefix: string): void {
  for (const key of inMemoryCache.keys()) {
    if (key.startsWith(prefix)) inMemoryCache.delete(key)
  }
}

export function buildCacheKey(type: CacheKey, ...parts: string[]): string {
  return `${type}:${parts.join(':')}`
}

export function getTtl(type: CacheKey): number {
  return CACHE_TTL_SECONDS[type]
}
