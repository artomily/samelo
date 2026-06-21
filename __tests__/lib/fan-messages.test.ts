import { describe, it, expect } from 'vitest'
import { hasTip, displaySubject, inboxLabel, unreadMessageCount } from '@/lib/types/fan-messages'
import type { FanMessage } from '@/lib/types/fan-messages'

function makeMsg(overrides: Partial<FanMessage> = {}): FanMessage {
  return {
    id: 'm1',
    from_wallet: '0xfan',
    to_wallet: '0xcreator',
    subject: null,
    body: 'Love your content!',
    is_read: false,
    is_archived: false,
    tip_melo: 0,
    created_at: '2026-06-01T00:00:00Z',
    ...overrides,
  }
}

describe('hasTip', () => {
  it('returns true when tip_melo > 0', () => {
    expect(hasTip(makeMsg({ tip_melo: 10 }))).toBe(true)
  })

  it('returns false when tip_melo is 0', () => {
    expect(hasTip(makeMsg({ tip_melo: 0 }))).toBe(false)
  })
})

describe('displaySubject', () => {
  it('returns subject when set', () => {
    expect(displaySubject(makeMsg({ subject: 'Hello' }))).toBe('Hello')
  })

  it('returns (no subject) when null', () => {
    expect(displaySubject(makeMsg({ subject: null }))).toBe('(no subject)')
  })

  it('returns (no subject) for blank subject', () => {
    expect(displaySubject(makeMsg({ subject: '   ' }))).toBe('(no subject)')
  })
})

describe('inboxLabel', () => {
  it('includes tip amount when present', () => {
    expect(inboxLabel(makeMsg({ subject: 'Hi', tip_melo: 25 }))).toBe('Hi [+25 MELO]')
  })

  it('omits tip suffix when no tip', () => {
    expect(inboxLabel(makeMsg({ subject: 'Hi', tip_melo: 0 }))).toBe('Hi')
  })
})

describe('unreadMessageCount', () => {
  it('counts unread non-archived messages', () => {
    const messages = [
      makeMsg({ is_read: false, is_archived: false }),
      makeMsg({ id: 'm2', is_read: true, is_archived: false }),
      makeMsg({ id: 'm3', is_read: false, is_archived: true }),
    ]
    expect(unreadMessageCount(messages)).toBe(1)
  })
})
