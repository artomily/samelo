import { describe, it, expect } from 'vitest'
import {
  calcRewardAmount,
  isClaimable,
  RANK_REWARD_SHARES,
} from '@/lib/types/leaderboard-rewards'
import type { RewardDistribution } from '@/lib/types/leaderboard-rewards'

function makeDist(overrides: Partial<RewardDistribution> = {}): RewardDistribution {
  return {
    id: 'd1',
    epoch_id: 'e1',
    wallet: '0xabc',
    rank: 1,
    points_earned: 1000,
    melo_amount: 300,
    tx_hash: null,
    claimed_at: null,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

describe('RANK_REWARD_SHARES', () => {
  it('top 10 shares sum to 1.0', () => {
    const sum = Object.values(RANK_REWARD_SHARES).reduce((a, b) => a + b, 0)
    expect(sum).toBeCloseTo(1.0)
  })

  it('rank 1 gets highest share', () => {
    expect(RANK_REWARD_SHARES[1]).toBeGreaterThan(RANK_REWARD_SHARES[2])
  })
})

describe('calcRewardAmount', () => {
  it('gives 30% of pool to rank 1', () => {
    expect(calcRewardAmount(1, 1000)).toBeCloseTo(300)
  })

  it('gives 0 for rank outside top 10', () => {
    expect(calcRewardAmount(11, 1000)).toBe(0)
  })

  it('returns a number with max 8 decimals', () => {
    const amount = calcRewardAmount(1, 1000)
    const decimals = amount.toString().split('.')[1]?.length ?? 0
    expect(decimals).toBeLessThanOrEqual(8)
  })
})

describe('isClaimable', () => {
  it('returns true when not claimed and amount > 0', () => {
    expect(isClaimable(makeDist())).toBe(true)
  })

  it('returns false when already claimed', () => {
    expect(isClaimable(makeDist({ claimed_at: new Date().toISOString() }))).toBe(false)
  })

  it('returns false when melo_amount is 0', () => {
    expect(isClaimable(makeDist({ melo_amount: 0 }))).toBe(false)
  })
})
