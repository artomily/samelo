import { describe, it, expect } from 'vitest'
import { SIGNAL_WEIGHTS, isCacheStale } from '@/lib/types/recommendations'
import type { RecommendationCache, SignalType } from '@/lib/types/recommendations'

const makeCache = (overrides: Partial<RecommendationCache> = {}): RecommendationCache => ({
  wallet: '0x1234567890123456789012345678901234567890',
  video_ids: [],
  reason: null,
  computed_at: new Date().toISOString(),
  ...overrides,
})

describe('SIGNAL_WEIGHTS', () => {
  it('replay has highest weight', () => {
    const weights = Object.values(SIGNAL_WEIGHTS)
    expect(SIGNAL_WEIGHTS.replay).toBe(Math.max(...weights))
  })

  it('watch has lowest weight', () => {
    const weights = Object.values(SIGNAL_WEIGHTS)
    expect(SIGNAL_WEIGHTS.watch).toBe(Math.min(...weights))
  })

  it('all signals have positive weights', () => {
    const types: SignalType[] = ['watch', 'complete', 'like', 'share', 'quiz_pass', 'replay']
    for (const t of types) {
      expect(SIGNAL_WEIGHTS[t]).toBeGreaterThan(0)
    }
  })
})

describe('isCacheStale', () => {
  it('returns false for fresh cache', () => {
    expect(isCacheStale(makeCache())).toBe(false)
  })

  it('returns true for old cache', () => {
    const old = makeCache({ computed_at: new Date(Date.now() - 3_700_000).toISOString() })
    expect(isCacheStale(old)).toBe(true)
  })

  it('respects custom maxAgeMs', () => {
    const recent = makeCache({ computed_at: new Date(Date.now() - 5000).toISOString() })
    expect(isCacheStale(recent, 1000)).toBe(true)
    expect(isCacheStale(recent, 10_000)).toBe(false)
  })
})
