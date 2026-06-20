export type OnchainRewardType = 'watch_milestone' | 'streak_bonus' | 'quiz_perfect' | 'referral_bonus' | 'level_up_bonus'
export type OnchainRewardStatus = 'queued' | 'signed' | 'submitted' | 'confirmed' | 'failed'

export interface OnchainRewardQueue {
  id: string
  wallet: string
  reward_type: OnchainRewardType
  amount_melo: number
  reference_id: string | null
  oracle_signature: string | null
  nonce: string
  status: OnchainRewardStatus
  tx_hash: string | null
  error_message: string | null
  created_at: string
  processed_at: string | null
}

export const REWARD_TYPE_LABELS: Record<OnchainRewardType, string> = {
  watch_milestone: 'Watch Milestone',
  streak_bonus: 'Streak Bonus',
  quiz_perfect: 'Perfect Quiz',
  referral_bonus: 'Referral Bonus',
  level_up_bonus: 'Level Up',
}

export const STATUS_COLORS_ONCHAIN: Record<OnchainRewardStatus, string> = {
  queued: '#888',
  signed: '#f1c135',
  submitted: '#60a5fa',
  confirmed: '#c8f135',
  failed: '#f13535',
}

export function isTerminal(reward: OnchainRewardQueue): boolean {
  return reward.status === 'confirmed' || reward.status === 'failed'
}

export function isPending(reward: OnchainRewardQueue): boolean {
  return reward.status === 'queued' || reward.status === 'signed' || reward.status === 'submitted'
}
