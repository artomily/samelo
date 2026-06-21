import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { STATUS_LABELS, STATUS_COLORS, isOpen, timeRemaining, winChance } from '@/lib/types/giveaways'
import type { Giveaway, GiveawayEntry } from '@/lib/types/giveaways'

function makeGiveaway(overrides: Partial<Giveaway> = {}): Giveaway {
  return {
    id: 'g1',
    creator_wallet: '0xabc',
    title: 'MELO Giveaway',
    description: null,
    prize_melo: 100,
    prize_description: null,
    max_entries: null,
    entry_count: 50,
    status: 'active',
    ends_at: '2099-01-01T00:00:00Z',
    winner_wallet: null,
    drawn_at: null,
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function makeEntry(overrides: Partial<GiveawayEntry> = {}): GiveawayEntry {
  return {
    id: 'e1',
    giveaway_id: 'g1',
    wallet: '0xuser',
    entry_count: 1,
    entered_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('STATUS_LABELS', () => {
  it('labels all statuses', () => {
    expect(STATUS_LABELS.active).toBe('Active')
    expect(STATUS_LABELS.drawn).toBe('Winner Drawn')
    expect(STATUS_LABELS.cancelled).toBe('Cancelled')
  })
})

describe('STATUS_COLORS', () => {
  it('assigns neon lime to active', () => {
    expect(STATUS_COLORS.active).toBe('#c8f135')
  })

  it('assigns red to cancelled', () => {
    expect(STATUS_COLORS.cancelled).toBe('#f13535')
  })
})

describe('isOpen', () => {
  it('returns true for active giveaway with future end', () => {
    expect(isOpen(makeGiveaway())).toBe(true)
  })

  it('returns false when status is not active', () => {
    expect(isOpen(makeGiveaway({ status: 'drawn' }))).toBe(false)
  })

  it('returns false when ends_at is in the past', () => {
    expect(isOpen(makeGiveaway({ ends_at: '2020-01-01T00:00:00Z' }))).toBe(false)
  })
})

describe('timeRemaining', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-21T12:00:00Z'))
  })
  afterEach(() => vi.useRealTimers())

  it('shows Ended for past giveaways', () => {
    expect(timeRemaining(makeGiveaway({ ends_at: '2026-06-21T11:00:00Z' }))).toBe('Ended')
  })

  it('shows minutes for sub-hour remaining', () => {
    expect(timeRemaining(makeGiveaway({ ends_at: '2026-06-21T12:30:00Z' }))).toBe('30m')
  })
})

describe('winChance', () => {
  it('returns 0 with no entries', () => {
    expect(winChance(makeEntry(), makeGiveaway({ entry_count: 0 }))).toBe(0)
  })

  it('calculates chance correctly', () => {
    expect(winChance(makeEntry({ entry_count: 1 }), makeGiveaway({ entry_count: 4 }))).toBe(25)
  })
})
