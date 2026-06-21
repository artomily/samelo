import { describe, it, expect } from 'vitest'
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  isAcceptingSubmissions,
  isExpired,
} from '@/lib/types/bounty-board'
import type { Bounty } from '@/lib/types/bounty-board'

function makeBounty(overrides: Partial<Bounty> = {}): Bounty {
  return {
    id: 'b1',
    creator_wallet: '0xabc',
    title: 'Fix login bug',
    description: 'Fix the wallet connect issue',
    reward_melo: 50,
    category: 'bug',
    status: 'open',
    deadline: null,
    winner_wallet: null,
    submission_count: 0,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('CATEGORY_LABELS', () => {
  it('labels all categories', () => {
    expect(CATEGORY_LABELS.bug).toBe('Bug Fix')
    expect(CATEGORY_LABELS.feature).toBe('Feature')
    expect(CATEGORY_LABELS.content).toBe('Content')
    expect(CATEGORY_LABELS.translation).toBe('Translation')
    expect(CATEGORY_LABELS.design).toBe('Design')
    expect(CATEGORY_LABELS.general).toBe('General')
  })
})

describe('STATUS_LABELS', () => {
  it('labels all statuses', () => {
    expect(STATUS_LABELS.open).toBe('Open')
    expect(STATUS_LABELS.completed).toBe('Completed')
  })
})

describe('STATUS_COLORS', () => {
  it('assigns neon lime to open', () => {
    expect(STATUS_COLORS.open).toBe('#c8f135')
  })
})

describe('isAcceptingSubmissions', () => {
  it('returns true for open bounties', () => {
    expect(isAcceptingSubmissions(makeBounty({ status: 'open' }))).toBe(true)
  })

  it('returns false for completed bounties', () => {
    expect(isAcceptingSubmissions(makeBounty({ status: 'completed' }))).toBe(false)
  })
})

describe('isExpired', () => {
  it('returns false with no deadline', () => {
    expect(isExpired(makeBounty())).toBe(false)
  })

  it('returns true for past deadline', () => {
    expect(isExpired(makeBounty({ deadline: '2020-01-01' }))).toBe(true)
  })

  it('returns false for future deadline', () => {
    expect(isExpired(makeBounty({ deadline: '2099-01-01' }))).toBe(false)
  })
})
