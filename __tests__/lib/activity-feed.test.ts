import { describe, it, expect } from 'vitest'
import { activityLabel, ACTIVITY_ICONS, ACTIVITY_LABELS } from '@/lib/types/activity-feed'
import type { ActivityEvent, ActivityEventType } from '@/lib/types/activity-feed'

const makeEvent = (eventType: ActivityEventType, pointsDelta = 0): ActivityEvent => ({
  id: 'ev1',
  wallet: '0x1234567890123456789012345678901234567890',
  event_type: eventType,
  payload: {},
  points_delta: pointsDelta,
  is_public: true,
  created_at: '2026-06-21T00:00:00Z',
})

describe('ACTIVITY_ICONS', () => {
  it('has an icon for every event type', () => {
    const types: ActivityEventType[] = [
      'watch_complete', 'quiz_pass', 'badge_earned', 'level_up', 'checkin',
      'stake', 'swap', 'follow', 'collection_create', 'governance_vote',
      'achievement_unlock', 'referral_join',
    ]
    for (const t of types) {
      expect(ACTIVITY_ICONS[t]).toBeTruthy()
    }
  })
})

describe('ACTIVITY_LABELS', () => {
  it('has a label for every event type', () => {
    const types = Object.keys(ACTIVITY_ICONS) as ActivityEventType[]
    for (const t of types) {
      expect(ACTIVITY_LABELS[t]).toBeTruthy()
    }
  })
})

describe('activityLabel', () => {
  it('returns correct label for watch_complete', () => {
    expect(activityLabel(makeEvent('watch_complete'))).toBe('Completed a watch')
  })

  it('returns correct label for governance_vote', () => {
    expect(activityLabel(makeEvent('governance_vote'))).toBe('Cast a governance vote')
  })
})
