import { describe, it, expect } from 'vitest'
import { isUnread, groupByDate } from '@/lib/types/notification-v2'
import type { NotificationV2 } from '@/lib/types/notification-v2'

function makeNotification(overrides: Partial<NotificationV2> = {}): NotificationV2 {
  return {
    id: 'n1',
    wallet: '0xabc',
    type: 'points_earned',
    title: 'Points earned',
    body: 'You earned 10 points',
    action_url: null,
    read_at: null,
    created_at: '2026-06-20T10:00:00Z',
    ...overrides,
  }
}

describe('isUnread', () => {
  it('returns true when read_at is null', () => {
    expect(isUnread(makeNotification())).toBe(true)
  })

  it('returns false when read_at is set', () => {
    expect(isUnread(makeNotification({ read_at: '2026-06-20T11:00:00Z' }))).toBe(false)
  })
})

describe('groupByDate', () => {
  it('groups notifications by locale date string', () => {
    const n1 = makeNotification({ id: 'n1', created_at: '2026-06-20T10:00:00Z' })
    const n2 = makeNotification({ id: 'n2', created_at: '2026-06-20T12:00:00Z' })
    const n3 = makeNotification({ id: 'n3', created_at: '2026-06-19T10:00:00Z' })
    const map = groupByDate([n1, n2, n3])
    expect(map.size).toBe(2)
    const groups = [...map.values()]
    const totalItems = groups.reduce((acc, g) => acc + g.length, 0)
    expect(totalItems).toBe(3)
  })

  it('returns empty map for empty input', () => {
    expect(groupByDate([])).toEqual(new Map())
  })

  it('handles single notification', () => {
    const map = groupByDate([makeNotification()])
    expect(map.size).toBe(1)
  })
})
