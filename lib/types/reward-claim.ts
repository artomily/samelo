export type ClaimSource = 'leaderboard' | 'referral' | 'staking' | 'mission' | 'bonus'
export type ClaimStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'rejected'

export interface RewardClaimRequest {
  id: string
  wallet: string
  source: ClaimSource
  amount_melo: number
  reference_id: string | null
  status: ClaimStatus
  tx_hash: string | null
  admin_note: string | null
  requested_at: string
  processed_at: string | null
}

export const CLAIM_SOURCE_LABELS: Record<ClaimSource, string> = {
  leaderboard: 'Leaderboard Reward',
  referral: 'Referral Bonus',
  staking: 'Staking Reward',
  mission: 'Mission Reward',
  bonus: 'Bonus',
}

export const CLAIM_STATUS_COLORS: Record<ClaimStatus, string> = {
  pending: '#888',
  processing: '#f1c135',
  paid: '#c8f135',
  failed: '#f13535',
  rejected: '#555',
}

export function isPending(claim: RewardClaimRequest): boolean {
  return claim.status === 'pending'
}

export function isPaid(claim: RewardClaimRequest): boolean {
  return claim.status === 'paid'
}
