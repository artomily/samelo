import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getCached, setCached, invalidateCache, buildCacheKey } from '@/lib/cache/redis'

describe('in-memory cache', () => {
  beforeEach(() => {
    invalidateCache('')
  })

  it('returns null for cache miss', () => {
    expect(getCached('nonexistent')).toBeNull()
  })

  it('returns cached value', () => {
    setCached('test-key', { foo: 'bar' }, 60)
    expect(getCached('test-key')).toEqual({ foo: 'bar' })
  })

  it('returns null after TTL expires', () => {
    vi.useFakeTimers()
    setCached('expiring', 'data', 1)
    vi.advanceTimersByTime(1001)
    expect(getCached('expiring')).toBeNull()
    vi.useRealTimers()
  })

  it('invalidateCache removes matching prefix', () => {
    setCached('user:1', 'data1', 60)
    setCached('user:2', 'data2', 60)
    setCached('video:1', 'video', 60)
    invalidateCache('user:')
    expect(getCached('user:1')).toBeNull()
    expect(getCached('user:2')).toBeNull()
    expect(getCached('video:1')).not.toBeNull()
  })

  it('buildCacheKey joins parts with colon', () => {
    expect(buildCacheKey('leaderboard', 'weekly', 'page-1')).toBe('leaderboard:weekly:page-1')
  })
})
