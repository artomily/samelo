import { describe, it, expect } from 'vitest'
import { getMissionProgress, isMissionComplete, clampProgress } from '@/lib/missions'

describe('getMissionProgress', () => {
  const baseStats = { watchCount: 10, quizCount: 5, referralCount: 2, totalPoints: 750 }

  it('returns watchCount for watch_count missions', () => {
    expect(getMissionProgress('watch_count', baseStats)).toBe(10)
  })

  it('returns quizCount for quiz_count missions', () => {
    expect(getMissionProgress('quiz_count', baseStats)).toBe(5)
  })

  it('returns referralCount for referral_count missions', () => {
    expect(getMissionProgress('referral_count', baseStats)).toBe(2)
  })

  it('returns totalPoints for points_threshold missions', () => {
    expect(getMissionProgress('points_threshold', baseStats)).toBe(750)
  })
})

describe('isMissionComplete', () => {
  it('returns true when progress equals target', () => {
    expect(isMissionComplete(10, 10)).toBe(true)
  })

  it('returns true when progress exceeds target', () => {
    expect(isMissionComplete(15, 10)).toBe(true)
  })

  it('returns false when progress is below target', () => {
    expect(isMissionComplete(9, 10)).toBe(false)
  })

  it('returns false at zero progress', () => {
    expect(isMissionComplete(0, 5)).toBe(false)
  })
})

describe('clampProgress', () => {
  it('returns progress when within range', () => {
    expect(clampProgress(3, 10)).toBe(3)
  })

  it('clamps to target when progress exceeds target', () => {
    expect(clampProgress(20, 10)).toBe(10)
  })

  it('clamps to 0 when progress is negative', () => {
    expect(clampProgress(-5, 10)).toBe(0)
  })

  it('returns 0 when progress is zero', () => {
    expect(clampProgress(0, 10)).toBe(0)
  })
})
