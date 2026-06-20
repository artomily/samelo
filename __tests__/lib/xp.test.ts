import { describe, it, expect } from 'vitest'
import { xpToLevel, xpToNextLevel, calcXp, updateStreak, LEVEL_NAMES } from '@/lib/xp'

describe('xpToLevel', () => {
  it('returns 1 (Observer) for xp < 50', () => {
    expect(xpToLevel(0)).toBe(1)
    expect(xpToLevel(49)).toBe(1)
  })
  it('returns 2 (Watcher) for xp 50–199', () => {
    expect(xpToLevel(50)).toBe(2)
    expect(xpToLevel(199)).toBe(2)
  })
  it('returns 3 (Miner) for xp 200–499', () => {
    expect(xpToLevel(200)).toBe(3)
  })
  it('returns 4 (Pioneer) for xp 500–999', () => {
    expect(xpToLevel(500)).toBe(4)
  })
  it('returns 5 (Legend) for xp >= 1000', () => {
    expect(xpToLevel(1000)).toBe(5)
    expect(xpToLevel(9999)).toBe(5)
  })
})

describe('xpToNextLevel', () => {
  it('returns progress 1 for max level', () => {
    const result = xpToNextLevel(1000)
    expect(result.progress).toBe(1)
  })
  it('returns 50% progress at midpoint of tier', () => {
    const result = xpToNextLevel(125) // midpoint of 50–200
    expect(result.progress).toBeCloseTo(0.5)
  })
})

describe('calcXp', () => {
  it('weights quizzes 3x and referrals 10x over watches', () => {
    expect(calcXp({ watchCount: 10, quizCount: 0, referralCount: 0 })).toBe(10)
    expect(calcXp({ watchCount: 0, quizCount: 10, referralCount: 0 })).toBe(30)
    expect(calcXp({ watchCount: 0, quizCount: 0, referralCount: 1 })).toBe(10)
  })
})

describe('updateStreak', () => {
  it('starts streak at 1 on first watch', () => {
    expect(updateStreak(null, '2026-06-19')).toEqual({ currentStreak: 1, isNewDay: true })
  })
  it('extends streak when watching consecutive day', () => {
    expect(updateStreak('2026-06-18', '2026-06-19')).toEqual({ currentStreak: 1, isNewDay: true })
  })
  it('resets streak if gap > 1 day', () => {
    expect(updateStreak('2026-06-15', '2026-06-19')).toEqual({ currentStreak: 0, isNewDay: true })
  })
  it('returns isNewDay=false if already watched today', () => {
    expect(updateStreak('2026-06-19', '2026-06-19')).toEqual({ currentStreak: 0, isNewDay: false })
  })
})

describe('LEVEL_NAMES', () => {
  it('maps level 5 to Legend', () => {
    expect(LEVEL_NAMES[5]).toBe('Legend')
  })
})
