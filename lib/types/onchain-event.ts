export type KnownEventName =
  | 'PointsEarned'
  | 'PointsRedeemed'
  | 'Staked'
  | 'Unstaked'
  | 'Swapped'
  | 'Transferred'

export interface OnchainEvent {
  id: string
  tx_hash: string
  block_number: number
  chain_id: number
  contract_address: string
  event_name: KnownEventName | string
  wallet: string | null
  data: Record<string, unknown>
  processed_at: string | null
  created_at: string
}

export interface EventIngestionPayload {
  txHash: string
  blockNumber: number
  chainId: number
  contractAddress: string
  eventName: string
  wallet?: string
  data?: Record<string, unknown>
}

export const EVENT_LABELS: Record<KnownEventName, string> = {
  PointsEarned: 'Points earned',
  PointsRedeemed: 'Points redeemed',
  Staked: 'MELO staked',
  Unstaked: 'MELO unstaked',
  Swapped: 'Token swapped',
  Transferred: 'Transfer',
}
