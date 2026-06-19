import { describe, it, expect } from 'vitest'
import { calcWatchReward, isEligibleWatch, watchProgressRatio } from '@/lib/watch-reward'

describe('calcWatchReward', () => {
  it('returns 0 for 0 seconds', () => {
    expect(calcWatchReward(0)).toBe(0)
  })

  it('awards 1 point per second up to 300s', () => {
    expect(calcWatchReward(60)).toBe(60)
    expect(calcWatchReward(300)).toBe(300)
  })

  it('caps reward at MAX_WATCH_SECONDS (300)', () => {
    expect(calcWatchReward(600)).toBe(300)
    expect(calcWatchReward(9999)).toBe(300)
  })
})

describe('isEligibleWatch', () => {
  it('returns false for under 10 seconds', () => {
    expect(isEligibleWatch(9)).toBe(false)
    expect(isEligibleWatch(0)).toBe(false)
  })

  it('returns true for 10 seconds or more', () => {
    expect(isEligibleWatch(10)).toBe(true)
    expect(isEligibleWatch(300)).toBe(true)
  })
})

describe('watchProgressRatio', () => {
  it('returns 0 for 0 seconds', () => {
    expect(watchProgressRatio(0)).toBe(0)
  })

  it('returns 0.5 at half max duration', () => {
    expect(watchProgressRatio(150)).toBe(0.5)
  })

  it('caps at 1.0 for durations beyond max', () => {
    expect(watchProgressRatio(600)).toBe(1)
  })
})
