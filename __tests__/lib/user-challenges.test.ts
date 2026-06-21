import { describe, it, expect } from 'vitest'
import {
  CHALLENGE_TYPE_LABELS,
  CHALLENGE_TYPE_COLORS,
  progressPct,
  isExpired,
  isClaimable,
} from '@/lib/types/user-challenges'
import type { Challenge, ChallengeProgress } from '@/lib/types/user-challenges'

function makeChallenge(overrides: Partial<Challenge> = {}): Challenge {
  return {
    id: 'c1',
    slug: 'daily-watcher',
    title: 'Daily Watcher',
    description: 'Watch 3 videos',
    challenge_type: 'daily',
    reward_melo: 5,
    target_count: 3,
    start_date: '2026-06-21',
    end_date: null,
    is_active: true,
    created_at: '2026-06-21T00:00:00Z',
    ...overrides,
  }
}

function makeProgress(overrides: Partial<ChallengeProgress> = {}): ChallengeProgress {
  return {
    id: 'p1',
    wallet: '0xabc',
    challenge_id: 'c1',
    current_count: 0,
    completed: false,
    completed_at: null,
    reward_claimed: false,
    updated_at: '2026-06-21T00:00:00Z',
    ...overrides,
  }
}

describe('CHALLENGE_TYPE_LABELS', () => {
  it('labels all types', () => {
    expect(CHALLENGE_TYPE_LABELS.daily).toBe('Daily')
    expect(CHALLENGE_TYPE_LABELS.weekly).toBe('Weekly')
    expect(CHALLENGE_TYPE_LABELS.seasonal).toBe('Seasonal')
    expect(CHALLENGE_TYPE_LABELS.special).toBe('Special')
  })
})

describe('CHALLENGE_TYPE_COLORS', () => {
  it('assigns neon lime to weekly', () => {
    expect(CHALLENGE_TYPE_COLORS.weekly).toBe('#c8f135')
  })
})

describe('progressPct', () => {
  it('returns 100 when completed', () => {
    expect(progressPct(makeProgress({ completed: true }), makeChallenge())).toBe(100)
  })

  it('calculates partial percentage', () => {
    expect(progressPct(makeProgress({ current_count: 1 }), makeChallenge({ target_count: 4 }))).toBe(25)
  })

  it('caps at 100', () => {
    expect(progressPct(makeProgress({ current_count: 99 }), makeChallenge({ target_count: 3 }))).toBe(100)
  })
})

describe('isExpired', () => {
  it('returns false when no end date', () => {
    expect(isExpired(makeChallenge())).toBe(false)
  })

  it('returns true for past end date', () => {
    expect(isExpired(makeChallenge({ end_date: '2020-01-01' }))).toBe(true)
  })

  it('returns false for future end date', () => {
    expect(isExpired(makeChallenge({ end_date: '2099-01-01' }))).toBe(false)
  })
})

describe('isClaimable', () => {
  it('returns true when completed and not claimed', () => {
    expect(isClaimable(makeProgress({ completed: true, reward_claimed: false }))).toBe(true)
  })

  it('returns false when not completed', () => {
    expect(isClaimable(makeProgress({ completed: false }))).toBe(false)
  })

  it('returns false when already claimed', () => {
    expect(isClaimable(makeProgress({ completed: true, reward_claimed: true }))).toBe(false)
  })
})
