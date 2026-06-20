import { describe, it, expect } from 'vitest'
import { NOTIFICATION_ICONS } from '@/lib/types/notification'

describe('NOTIFICATION_ICONS', () => {
  it('has icon for every notification type', () => {
    const types = ['reward_earned', 'mission_complete', 'mission_claimed',
      'referral_redeemed', 'swap_complete', 'achievement_unlocked', 'streak_milestone']
    for (const type of types) {
      expect(NOTIFICATION_ICONS[type as keyof typeof NOTIFICATION_ICONS]).toBeTruthy()
    }
  })

  it('all icons are emoji strings', () => {
    Object.values(NOTIFICATION_ICONS).forEach(icon => {
      expect(typeof icon).toBe('string')
      expect(icon.length).toBeGreaterThan(0)
    })
  })
})
