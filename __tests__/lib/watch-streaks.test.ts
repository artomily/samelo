import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  STREAK_MILESTONES,
  MILESTONE_BONUS_MELO,
  isStreakActive,
  nextMilestone,
  daysToNextMilestone,
} from '@/lib/types/watch-streaks'
import type { WatchStreak } from '@/lib/types/watch-streaks'

function makeStreak(overrides: Partial<WatchStreak> = {}): WatchStreak {
  return {
    id: 's1',
    wallet: '0xabc',
    current_streak: 0,
    longest_streak: 0,
    last_watch_date: null,
    streak_started_at: null,
    total_watch_days: 0,
    updated_at: '2026-06-21T00:00:00Z',
    ...overrides,
  }
}

describe('STREAK_MILESTONES', () => {
  it('is sorted ascending', () => {
    const sorted = [...STREAK_MILESTONES].sort((a, b) => a - b)
    expect(Array.from(STREAK_MILESTONES)).toEqual(sorted)
  })

  it('has bonus for every milestone', () => {
    for (const m of STREAK_MILESTONES) {
      expect(MILESTONE_BONUS_MELO[m]).toBeGreaterThan(0)
    }
  })
})

describe('isStreakActive', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-21T12:00:00Z'))
  })
  afterEach(() => vi.useRealTimers())

  it('returns false when no last watch date', () => {
    expect(isStreakActive(makeStreak())).toBe(false)
  })

  it('returns true when watched today', () => {
    expect(isStreakActive(makeStreak({ last_watch_date: '2026-06-21' }))).toBe(true)
  })

  it('returns true when watched yesterday', () => {
    expect(isStreakActive(makeStreak({ last_watch_date: '2026-06-20' }))).toBe(true)
  })

  it('returns false when watched 2 days ago', () => {
    expect(isStreakActive(makeStreak({ last_watch_date: '2026-06-19' }))).toBe(false)
  })
})

describe('nextMilestone', () => {
  it('returns first milestone when streak is 0', () => {
    expect(nextMilestone(makeStreak({ current_streak: 0 }))).toBe(3)
  })

  it('returns next milestone above current', () => {
    expect(nextMilestone(makeStreak({ current_streak: 5 }))).toBe(7)
  })

  it('returns null when past all milestones', () => {
    expect(nextMilestone(makeStreak({ current_streak: 100 }))).toBeNull()
  })
})

describe('daysToNextMilestone', () => {
  it('returns days remaining to next milestone', () => {
    expect(daysToNextMilestone(makeStreak({ current_streak: 4 }))).toBe(3)
  })

  it('returns null when all milestones passed', () => {
    expect(daysToNextMilestone(makeStreak({ current_streak: 100 }))).toBeNull()
  })
})
