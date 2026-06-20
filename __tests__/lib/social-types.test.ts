import { describe, it, expect } from 'vitest'
import { ACTIVITY_ICONS, ACTIVITY_LABELS, type ActivityEventType } from '@/lib/types/social'

const EVENT_TYPES: ActivityEventType[] = ['watch', 'quiz', 'swap', 'stake', 'achievement', 'follow']

describe('social types', () => {
  it('ACTIVITY_ICONS has entry for every event type', () => {
    for (const type of EVENT_TYPES) {
      expect(ACTIVITY_ICONS[type]).toBeTruthy()
    }
  })

  it('ACTIVITY_LABELS has entry for every event type', () => {
    for (const type of EVENT_TYPES) {
      expect(ACTIVITY_LABELS[type]).toBeTruthy()
    }
  })

  it('ACTIVITY_LABELS are human-readable strings', () => {
    expect(ACTIVITY_LABELS.watch).toBe('watched a video')
    expect(ACTIVITY_LABELS.follow).toBe('started following')
  })
})
