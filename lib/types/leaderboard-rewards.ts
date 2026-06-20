export type RewardPeriod = 'weekly' | 'monthly'

export interface RewardEpoch {
  id: string
  epoch_number: number
  period: RewardPeriod
  starts_at: string
  ends_at: string
  total_reward_pool_melo: number
  distributed: boolean
  distributed_at: string | null
  created_at: string
}

export interface RewardDistribution {
  id: string
  epoch_id: string
  wallet: string
  rank: number
  points_earned: number
  melo_amount: number
  tx_hash: string | null
  claimed_at: string | null
  created_at: string
}

export const RANK_REWARD_SHARES: Record<number, number> = {
  1: 0.30,
  2: 0.20,
  3: 0.15,
  4: 0.10,
  5: 0.08,
  6: 0.06,
  7: 0.04,
  8: 0.03,
  9: 0.02,
  10: 0.02,
}

export function calcRewardAmount(rank: number, totalPool: number): number {
  const share = RANK_REWARD_SHARES[rank] ?? 0
  return parseFloat((totalPool * share).toFixed(8))
}

export function isClaimable(dist: RewardDistribution): boolean {
  return dist.claimed_at === null && dist.melo_amount > 0
}
