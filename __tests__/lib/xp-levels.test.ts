import { describe, it, expect } from 'vitest'
import {
  getLevelForXp,
  getXpToNextLevel,
  getLevelProgressPct,
  LEVELS,
  XP_PER_WATCH,
  XP_PER_QUIZ,
  XP_PER_REFERRAL,
} from '../../lib/types/xp'

describe('getLevelForXp', () => {
  it('returns level 1 at 0 XP', () => {
    expect(getLevelForXp(0).level).toBe(1)
    expect(getLevelForXp(0).title).toBe('Observer')
  })

  it('returns level 2 at 500 XP', () => {
    expect(getLevelForXp(500).level).toBe(2)
    expect(getLevelForXp(500).title).toBe('Watcher')
  })

  it('returns level 5 (Legend) at max XP', () => {
    expect(getLevelForXp(15000).level).toBe(5)
    expect(getLevelForXp(15000).title).toBe('Legend')
  })

  it('caps at max level for very high XP', () => {
    const max = LEVELS[LEVELS.length - 1]!
    expect(getLevelForXp(1_000_000).level).toBe(max.level)
  })
})

describe('getXpToNextLevel', () => {
  it('returns 500 at 0 XP (0 → 500 for level 2)', () => {
    expect(getXpToNextLevel(0)).toBe(500)
  })

  it('returns 0 at max level', () => {
    expect(getXpToNextLevel(15000)).toBe(0)
  })
})

describe('getLevelProgressPct', () => {
  it('returns 0 at level start', () => {
    expect(getLevelProgressPct(0)).toBe(0)
  })

  it('returns 100 at max level', () => {
    expect(getLevelProgressPct(99999)).toBe(100)
  })
})

describe('XP constants', () => {
  it('quiz XP > watch XP', () => {
    expect(XP_PER_QUIZ).toBeGreaterThan(XP_PER_WATCH)
  })

  it('referral XP is highest single-action reward', () => {
    expect(XP_PER_REFERRAL).toBeGreaterThan(XP_PER_QUIZ)
  })
})
