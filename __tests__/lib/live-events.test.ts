import { describe, it, expect } from 'vitest'
import { isUpcoming, formatEventTime, STATUS_COLORS, STATUS_LABELS } from '@/lib/types/live-events'
import type { LiveEvent } from '@/lib/types/live-events'

const makeEvent = (overrides: Partial<LiveEvent> = {}): LiveEvent => ({
  id: 'e1',
  title: 'AMA with Team',
  description: null,
  host_wallet: '0x1234567890123456789012345678901234567890',
  stream_url: null,
  thumbnail_url: null,
  scheduled_at: new Date(Date.now() + 86400_000).toISOString(),
  started_at: null,
  ended_at: null,
  status: 'scheduled',
  max_attendees: null,
  points_reward: 50,
  created_at: '2026-06-21T00:00:00Z',
  ...overrides,
})

describe('isUpcoming', () => {
  it('returns true for scheduled event in the future', () => {
    expect(isUpcoming(makeEvent())).toBe(true)
  })

  it('returns false for live event', () => {
    expect(isUpcoming(makeEvent({ status: 'live' }))).toBe(false)
  })

  it('returns false for past scheduled event', () => {
    const past = makeEvent({ scheduled_at: new Date(Date.now() - 1000).toISOString() })
    expect(isUpcoming(past)).toBe(false)
  })

  it('returns false for ended event', () => {
    expect(isUpcoming(makeEvent({ status: 'ended' }))).toBe(false)
  })
})

describe('STATUS_COLORS', () => {
  it('live color is lime', () => {
    expect(STATUS_COLORS.live).toBe('#c8f135')
  })

  it('cancelled color is red', () => {
    expect(STATUS_COLORS.cancelled).toBe('#f13535')
  })
})

describe('STATUS_LABELS', () => {
  it('all statuses have labels', () => {
    expect(STATUS_LABELS.live).toBe('Live Now')
    expect(STATUS_LABELS.scheduled).toBe('Scheduled')
    expect(STATUS_LABELS.ended).toBe('Ended')
    expect(STATUS_LABELS.cancelled).toBe('Cancelled')
  })
})

describe('formatEventTime', () => {
  it('returns a non-empty string', () => {
    const result = formatEventTime('2026-06-21T18:00:00Z')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})
