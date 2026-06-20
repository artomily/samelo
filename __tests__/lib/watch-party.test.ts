import { describe, it, expect } from 'vitest'
import { isHost, isAtCapacity, STATUS_LABELS, STATUS_COLORS } from '@/lib/types/watch-party'
import type { WatchParty } from '@/lib/types/watch-party'

function makeParty(overrides: Partial<WatchParty> = {}): WatchParty {
  return {
    id: 'party-1',
    host_wallet: '0xHost',
    video_id: 'vid-1',
    title: 'Watch Party',
    status: 'lobby',
    max_participants: 50,
    playback_position_seconds: 0,
    started_at: null,
    ended_at: null,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

describe('isHost', () => {
  it('returns true for exact match', () => {
    expect(isHost(makeParty(), '0xHost')).toBe(true)
  })

  it('is case-insensitive', () => {
    expect(isHost(makeParty(), '0xhost')).toBe(true)
    expect(isHost(makeParty({ host_wallet: '0xABC' }), '0xabc')).toBe(true)
  })

  it('returns false for non-host', () => {
    expect(isHost(makeParty(), '0xGuest')).toBe(false)
  })
})

describe('isAtCapacity', () => {
  it('returns true when at max', () => {
    expect(isAtCapacity(makeParty({ max_participants: 10 }), 10)).toBe(true)
  })

  it('returns false when under max', () => {
    expect(isAtCapacity(makeParty({ max_participants: 10 }), 9)).toBe(false)
  })
})

describe('STATUS_LABELS', () => {
  it('has labels for all 3 statuses', () => {
    expect(STATUS_LABELS.lobby).toBeTruthy()
    expect(STATUS_LABELS.live).toBeTruthy()
    expect(STATUS_LABELS.ended).toBeTruthy()
  })
})

describe('STATUS_COLORS', () => {
  it('live is lime', () => {
    expect(STATUS_COLORS.live).toBe('#c8f135')
  })
})
