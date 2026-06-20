export interface StakePosition {
  id: string
  walletAddress: string
  amountMelo: string
  stakedAt: string
  unlockAt: string
  lockDays: number
  bonusMultiplier: number
  isActive: boolean
  claimedAt: string | null
}

export interface StakingTier {
  lockDays: number
  label: string
  bonusMultiplier: number
  bonusPercent: number
}

export const STAKING_TIERS: StakingTier[] = [
  { lockDays: 7,  label: '1 Week',   bonusMultiplier: 1.05, bonusPercent: 5  },
  { lockDays: 30, label: '1 Month',  bonusMultiplier: 1.15, bonusPercent: 15 },
  { lockDays: 90, label: '3 Months', bonusMultiplier: 1.35, bonusPercent: 35 },
  { lockDays: 180, label: '6 Months', bonusMultiplier: 1.75, bonusPercent: 75 },
]

export function stakingTierForDays(days: number): StakingTier | undefined {
  return STAKING_TIERS.find(t => t.lockDays === days)
}

export function isUnlocked(unlockAt: string): boolean {
  return new Date(unlockAt) <= new Date()
}

export function daysRemaining(unlockAt: string): number {
  const diff = new Date(unlockAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86_400_000))
}
