export type TxType = 'inflow' | 'outflow' | 'transfer'
export type TxCategory =
  | 'protocol_fee'
  | 'subscription'
  | 'tip_fee'
  | 'stake_reward'
  | 'grant'
  | 'marketing'
  | 'development'
  | 'operations'
  | 'reward_payout'
  | 'other'

export interface TreasuryTransaction {
  id: string
  tx_type: TxType
  category: TxCategory
  amount_melo: number
  amount_usd: number | null
  description: string | null
  tx_hash: string | null
  from_address: string | null
  to_address: string | null
  block_number: number | null
  epoch: string | null
  created_at: string
}

export interface TreasurySnapshot {
  id: string
  balance_melo: number
  balance_cusd: number
  total_inflow_melo: number
  total_outflow_melo: number
  snapshot_date: string
  created_at: string
}

export const CATEGORY_LABELS: Record<TxCategory, string> = {
  protocol_fee: 'Protocol Fee',
  subscription: 'Subscription',
  tip_fee: 'Tip Fee',
  stake_reward: 'Stake Reward',
  grant: 'Grant',
  marketing: 'Marketing',
  development: 'Development',
  operations: 'Operations',
  reward_payout: 'Reward Payout',
  other: 'Other',
}

export function netFlow(snapshot: TreasurySnapshot): number {
  return parseFloat((snapshot.total_inflow_melo - snapshot.total_outflow_melo).toFixed(8))
}

export function txTypeColor(txType: TxType): string {
  return txType === 'inflow' ? '#c8f135' : txType === 'outflow' ? '#f13535' : '#888'
}
