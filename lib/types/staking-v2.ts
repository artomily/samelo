export type StakingTierV2 = 1 | 2 | 3 | 4

export interface StakingTierConfigV2 {
  tier: StakingTierV2
  durationDays: number
  bonusMultiplier: number
  label: string
  minMelo: number
}

export interface StakingPosition {
  id: string
  wallet: string
  amount_melo: number
  tier: StakingTierV2
  duration_days: number
  bonus_multiplier: number
  staked_at: string
  unstake_at: string
  unstaked_at: string | null
  reward_points: number
  tx_hash: string | null
}

export interface StakingReward {
  id: string
  position_id: string
  wallet: string
  points: number
  epoch_date: string
  created_at: string
}

export const STAKING_TIER_CONFIGS: StakingTierConfigV2[] = [
  { tier: 1, durationDays: 7,   bonusMultiplier: 1.1,  label: 'Bronze — 7 days',    minMelo: 10  },
  { tier: 2, durationDays: 30,  bonusMultiplier: 1.25, label: 'Silver — 30 days',   minMelo: 50  },
  { tier: 3, durationDays: 90,  bonusMultiplier: 1.5,  label: 'Gold — 90 days',     minMelo: 100 },
  { tier: 4, durationDays: 180, bonusMultiplier: 2.0,  label: 'Diamond — 180 days', minMelo: 500 },
]

export function getTierConfigV2(tier: StakingTierV2): StakingTierConfigV2 {
  return STAKING_TIER_CONFIGS[tier - 1]!
}

export function isPositionUnlocked(position: StakingPosition): boolean {
  return new Date() >= new Date(position.unstake_at)
}

export function getPositionDaysRemaining(position: StakingPosition): number {
  const diff = new Date(position.unstake_at).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86_400_000))
}

export function calcDailyRewardPoints(amountMelo: number, multiplier: number): number {
  return Math.floor(amountMelo * multiplier)
}
