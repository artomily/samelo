import { describe, it, expect } from 'vitest'
import { STAKING_TIERS, stakingTierForDays, isUnlocked, daysRemaining } from '@/lib/types/staking'

describe('STAKING_TIERS', () => {
  it('has 4 tiers', () => {
    expect(STAKING_TIERS).toHaveLength(4)
  })

  it('bonus increases with lock duration', () => {
    const bonuses = STAKING_TIERS.map(t => t.bonusMultiplier)
    for (let i = 1; i < bonuses.length; i++) {
      expect(bonuses[i]).toBeGreaterThan(bonuses[i - 1])
    }
  })

  it('6-month tier has 75% bonus', () => {
    const tier = STAKING_TIERS.find(t => t.lockDays === 180)!
    expect(tier.bonusPercent).toBe(75)
  })
})

describe('stakingTierForDays', () => {
  it('returns tier for valid lock days', () => {
    expect(stakingTierForDays(30)?.label).toBe('1 Month')
  })

  it('returns undefined for invalid days', () => {
    expect(stakingTierForDays(99)).toBeUndefined()
  })
})

describe('isUnlocked', () => {
  it('returns true for past date', () => {
    expect(isUnlocked('2020-01-01T00:00:00Z')).toBe(true)
  })

  it('returns false for future date', () => {
    expect(isUnlocked('2099-01-01T00:00:00Z')).toBe(false)
  })
})

describe('daysRemaining', () => {
  it('returns 0 for past unlock date', () => {
    expect(daysRemaining('2020-01-01T00:00:00Z')).toBe(0)
  })

  it('returns positive value for future date', () => {
    const future = new Date(Date.now() + 5 * 86_400_000).toISOString()
    expect(daysRemaining(future)).toBeGreaterThan(0)
  })
})
