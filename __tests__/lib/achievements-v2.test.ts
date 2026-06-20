import { describe, it, expect } from 'vitest'
import { getProgressPct, isUnlocked, CATEGORY_LABELS } from '../../lib/types/achievement'
import type { UserAchievement } from '../../lib/types/achievement'

function makeAchievement(overrides: Partial<UserAchievement> = {}): UserAchievement {
  return {
    id: 'test',
    wallet: '0xabc',
    achievement_id: 'first_watch',
    progress: 0,
    unlocked_at: null,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

describe('getProgressPct', () => {
  it('returns 0 for no progress', () => {
    expect(getProgressPct(0, 10)).toBe(0)
  })

  it('returns 50 at midpoint', () => {
    expect(getProgressPct(5, 10)).toBe(50)
  })

  it('returns 100 at threshold', () => {
    expect(getProgressPct(10, 10)).toBe(100)
  })

  it('caps at 100 when exceeding threshold', () => {
    expect(getProgressPct(15, 10)).toBe(100)
  })
})

describe('isUnlocked', () => {
  it('returns false when unlocked_at is null', () => {
    expect(isUnlocked(makeAchievement())).toBe(false)
  })

  it('returns true when unlocked_at is set', () => {
    expect(isUnlocked(makeAchievement({ unlocked_at: new Date().toISOString() }))).toBe(true)
  })
})

describe('CATEGORY_LABELS', () => {
  it('has a label for each category', () => {
    const cats = ['watch', 'quiz', 'social', 'stake', 'swap', 'general'] as const
    for (const cat of cats) {
      expect(typeof CATEGORY_LABELS[cat]).toBe('string')
      expect(CATEGORY_LABELS[cat].length).toBeGreaterThan(0)
    }
  })
})
