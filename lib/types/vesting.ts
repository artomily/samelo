export type VestingCategory = 'team' | 'advisor' | 'community' | 'investor' | 'grants'

export interface VestingSchedule {
  id: string
  wallet: string
  total_melo: number
  vested_melo: number
  cliff_at: string
  vest_start: string
  vest_end: string
  category: VestingCategory
  claimed: boolean
  created_at: string
}

export interface VestingClaim {
  id: string
  schedule_id: string
  wallet: string
  amount: number
  tx_hash: string | null
  claimed_at: string
}

export const CATEGORY_COLORS: Record<VestingCategory, string> = {
  team: '#c8f135',
  advisor: '#60a5fa',
  community: '#34d399',
  investor: '#f59e0b',
  grants: '#a78bfa',
}

export const CATEGORY_LABELS: Record<VestingCategory, string> = {
  team: 'Team',
  advisor: 'Advisor',
  community: 'Community',
  investor: 'Investor',
  grants: 'Grants',
}

export function computeVestedAmount(schedule: VestingSchedule, at = new Date()): number {
  const now = at.getTime()
  const cliff = new Date(schedule.cliff_at).getTime()
  const start = new Date(schedule.vest_start).getTime()
  const end = new Date(schedule.vest_end).getTime()

  if (now < cliff) return 0
  if (now >= end) return schedule.total_melo

  const elapsed = now - start
  const total = end - start
  return Math.floor(schedule.total_melo * (elapsed / total) * 1e8) / 1e8
}

export function getClaimableAmount(schedule: VestingSchedule, at = new Date()): number {
  const vested = computeVestedAmount(schedule, at)
  return Math.max(0, vested - schedule.vested_melo)
}
