import { describe, it, expect } from 'vitest'
import {
  STAKING_TIER_CONFIGS,
  getTierConfigV2,
  isPositionUnlocked,
  getPositionDaysRemaining,
  calcDailyRewardPoints,
} from '../../lib/types/staking-v2'
import type { StakingPosition } from '../../lib/types/staking-v2'

function makePosition(overrides: Partial<StakingPosition> = {}): StakingPosition {
  return {
    id: 'test',
    wallet: '0xabc',
    amount_melo: 100,
    tier: 2,
    duration_days: 30,
    bonus_multiplier: 1.25,
    staked_at: new Date('2024-01-01').toISOString(),
    unstake_at: new Date('2024-01-31').toISOString(),
    unstaked_at: null,
    reward_points: 0,
    tx_hash: null,
    ...overrides,
  }
}

describe('STAKING_TIER_CONFIGS', () => {
  it('has 4 tiers', () => {
    expect(STAKING_TIER_CONFIGS).toHaveLength(4)
  })

  it('tiers are ordered by duration', () => {
    const days = STAKING_TIER_CONFIGS.map(t => t.durationDays)
    expect(days).toEqual([7, 30, 90, 180])
  })

  it('multipliers increase with duration', () => {
    const multipliers = STAKING_TIER_CONFIGS.map(t => t.bonusMultiplier)
    for (let i = 1; i < multipliers.length; i++) {
      expect(multipliers[i]).toBeGreaterThan(multipliers[i - 1]!)
    }
  })
})

describe('getTierConfigV2', () => {
  it('returns correct config for each tier', () => {
    expect(getTierConfigV2(1).durationDays).toBe(7)
    expect(getTierConfigV2(4).durationDays).toBe(180)
  })
})

describe('isPositionUnlocked', () => {
  it('returns true if unlock date is past', () => {
    const pos = makePosition({ unstake_at: new Date('2020-01-01').toISOString() })
    expect(isPositionUnlocked(pos)).toBe(true)
  })

  it('returns false if unlock date is in future', () => {
    const pos = makePosition({ unstake_at: new Date('2099-01-01').toISOString() })
    expect(isPositionUnlocked(pos)).toBe(false)
  })
})

describe('getPositionDaysRemaining', () => {
  it('returns 0 for past positions', () => {
    const pos = makePosition({ unstake_at: new Date('2020-01-01').toISOString() })
    expect(getPositionDaysRemaining(pos)).toBe(0)
  })
})

describe('calcDailyRewardPoints', () => {
  it('multiplies amount by multiplier', () => {
    expect(calcDailyRewardPoints(100, 1.25)).toBe(125)
  })

  it('floors the result', () => {
    expect(calcDailyRewardPoints(10, 1.1)).toBe(11)
  })
})
