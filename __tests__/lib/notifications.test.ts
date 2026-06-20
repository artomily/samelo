import { describe, it, expect } from 'vitest'
import { NOTIFICATION_ICONS, DEFAULT_PREFERENCES, type NotificationType } from '@/lib/types/notification'

describe('notification types', () => {
  const TYPES: NotificationType[] = ['achievement', 'reward', 'social', 'system', 'swap', 'stake']

  it('NOTIFICATION_ICONS has an entry for every type', () => {
    for (const type of TYPES) {
      expect(NOTIFICATION_ICONS[type]).toBeTruthy()
    }
  })

  it('DEFAULT_PREFERENCES enables all notification types', () => {
    for (const type of TYPES) {
      expect(DEFAULT_PREFERENCES[type]).toBe(true)
    }
  })

  it('DEFAULT_PREFERENCES has all required keys', () => {
    expect(Object.keys(DEFAULT_PREFERENCES).sort()).toEqual(TYPES.sort())
  })

  it('all icons are emoji strings', () => {
    for (const icon of Object.values(NOTIFICATION_ICONS)) {
      expect(typeof icon).toBe('string')
      expect(icon.length).toBeGreaterThan(0)
    }
  })
})
