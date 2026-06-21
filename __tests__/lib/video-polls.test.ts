import { describe, it, expect } from 'vitest'
import { isOpen, optionPct, topOption } from '@/lib/types/video-polls'
import type { VideoPoll, PollOption } from '@/lib/types/video-polls'

function makePoll(overrides: Partial<VideoPoll> = {}): VideoPoll {
  return {
    id: 'p1',
    video_id: 'v1',
    creator_wallet: '0xabc',
    question: 'Which is best?',
    is_multiple_choice: false,
    ends_at: null,
    is_active: true,
    created_at: '2026-06-01T00:00:00Z',
    ...overrides,
  }
}

function makeOption(id: string, voteCount: number): PollOption {
  return { id, poll_id: 'p1', option_text: `Option ${id}`, option_index: 0, vote_count: voteCount }
}

describe('isOpen', () => {
  it('returns true when active and no end date', () => {
    expect(isOpen(makePoll())).toBe(true)
  })

  it('returns false when inactive', () => {
    expect(isOpen(makePoll({ is_active: false }))).toBe(false)
  })

  it('returns false when past end date', () => {
    expect(isOpen(makePoll({ ends_at: '2020-01-01T00:00:00Z' }))).toBe(false)
  })

  it('returns true when future end date', () => {
    expect(isOpen(makePoll({ ends_at: '2099-01-01T00:00:00Z' }))).toBe(true)
  })
})

describe('optionPct', () => {
  it('returns 0 with no votes', () => {
    expect(optionPct(makeOption('a', 0), 0)).toBe(0)
  })

  it('calculates percentage', () => {
    expect(optionPct(makeOption('a', 3), 10)).toBe(30)
  })

  it('rounds to nearest integer', () => {
    expect(optionPct(makeOption('a', 1), 3)).toBe(33)
  })
})

describe('topOption', () => {
  it('returns null for empty options', () => {
    expect(topOption([])).toBeNull()
  })

  it('returns option with most votes', () => {
    const opts = [makeOption('a', 5), makeOption('b', 10), makeOption('c', 2)]
    expect(topOption(opts)!.id).toBe('b')
  })

  it('returns first when tied', () => {
    const opts = [makeOption('a', 5), makeOption('b', 5)]
    expect(topOption(opts)!.id).toBe('a')
  })
})
