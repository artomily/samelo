import { describe, it, expect } from 'vitest'
import { formatWatchTime, calcEngagementRate } from '@/lib/types/creator'

describe('formatWatchTime', () => {
  it('formats seconds', () => {
    expect(formatWatchTime(45)).toBe('45s')
  })

  it('formats minutes', () => {
    expect(formatWatchTime(90)).toBe('1m')
    expect(formatWatchTime(3599)).toBe('59m')
  })

  it('formats hours', () => {
    expect(formatWatchTime(3600)).toBe('1h')
    expect(formatWatchTime(3660)).toBe('1h 1m')
    expect(formatWatchTime(7200)).toBe('2h')
  })
})

describe('calcEngagementRate', () => {
  it('returns 0 for zero views', () => {
    expect(calcEngagementRate(0, 0)).toBe(0)
  })

  it('caps at 100', () => {
    expect(calcEngagementRate(1, 1_000_000)).toBe(100)
  })

  it('calculates based on 120s benchmark', () => {
    const rate = calcEngagementRate(10, 600)
    expect(rate).toBe(50)
  })
})
