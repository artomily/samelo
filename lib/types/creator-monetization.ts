export type EarningsSourceType = 'watch_reward' | 'quiz_reward' | 'tip' | 'subscription_share' | 'referral'
export type PayoutStatus = 'pending' | 'paid' | 'failed'

export interface CreatorEarning {
  id: string
  creator_wallet: string
  source_type: EarningsSourceType
  gross_amount_melo: number
  platform_fee_melo: number
  net_amount_melo: number
  video_id: string | null
  reference_id: string | null
  paid_out: boolean
  created_at: string
}

export interface CreatorPayoutRequest {
  id: string
  creator_wallet: string
  amount_melo: number
  status: PayoutStatus
  tx_hash: string | null
  created_at: string
}

export const SOURCE_LABELS: Record<EarningsSourceType, string> = {
  watch_reward: 'Watch Reward',
  quiz_reward: 'Quiz Reward',
  tip: 'Tip',
  subscription_share: 'Subscription Share',
  referral: 'Referral',
}

export const DEFAULT_PLATFORM_FEE_PCT = 20

export function calcNetAmount(grossMelo: number, platformFeePct = DEFAULT_PLATFORM_FEE_PCT): number {
  const fee = parseFloat(((grossMelo * platformFeePct) / 100).toFixed(8))
  return parseFloat((grossMelo - fee).toFixed(8))
}

export function calcPlatformFee(grossMelo: number, platformFeePct = DEFAULT_PLATFORM_FEE_PCT): number {
  return parseFloat(((grossMelo * platformFeePct) / 100).toFixed(8))
}
