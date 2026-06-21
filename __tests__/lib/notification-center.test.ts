import { describe, it, expect } from 'vitest'
import {
  NOTIFICATION_ICONS,
  NOTIFICATION_COLORS,
  unreadCount,
  groupByDate,
} from '@/lib/types/notifications'
import type { NotificationCenterItem, NotificationType } from '@/lib/types/notifications'

function makeItem(overrides: Partial<NotificationCenterItem> = {}): NotificationCenterItem {
  return {
    id: 'n1',
    wallet: '0xabc',
    type: 'system' as NotificationType,
    title: 'Hello',
    body: 'World',
    action_url: null,
    image_url: null,
    is_read: false,
    created_at: '2026-06-15T10:00:00Z',
    ...overrides,
  }
}

describe('NOTIFICATION_ICONS', () => {
  it('has an icon for every type', () => {
    const types: NotificationType[] = [
      'reward_earned', 'badge_awarded', 'follow', 'tip_received',
      'governance_vote', 'event_starting', 'achievement_unlocked', 'system',
    ]
    for (const t of types) {
      expect(NOTIFICATION_ICONS[t]).toBeTruthy()
    }
  })
})

describe('NOTIFICATION_COLORS', () => {
  it('assigns neon lime to reward_earned', () => {
    expect(NOTIFICATION_COLORS.reward_earned).toBe('#c8f135')
  })

  it('assigns neon lime to badge_awarded', () => {
    expect(NOTIFICATION_COLORS.badge_awarded).toBe('#c8f135')
  })
})

describe('unreadCount', () => {
  it('counts unread items', () => {
    const items = [
      makeItem({ is_read: false }),
      makeItem({ id: 'n2', is_read: true }),
      makeItem({ id: 'n3', is_read: false }),
    ]
    expect(unreadCount(items)).toBe(2)
  })

  it('returns 0 when all read', () => {
    expect(unreadCount([makeItem({ is_read: true })])).toBe(0)
  })
})

describe('groupByDate', () => {
  it('groups items by calendar day', () => {
    const items = [
      makeItem({ id: 'n1', created_at: '2026-06-15T10:00:00Z' }),
      makeItem({ id: 'n2', created_at: '2026-06-15T14:00:00Z' }),
      makeItem({ id: 'n3', created_at: '2026-06-16T09:00:00Z' }),
    ]
    const groups = groupByDate(items)
    expect(Object.keys(groups)).toHaveLength(2)
    expect(groups['2026-06-15']).toHaveLength(2)
    expect(groups['2026-06-16']).toHaveLength(1)
  })
})
