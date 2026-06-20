export type TipStatus = 'pending' | 'confirmed' | 'failed'

export interface Tip {
  id: string
  sender_wallet: string
  recipient_wallet: string
  amount_melo: number
  message: string | null
  video_id: string | null
  tx_hash: string | null
  status: TipStatus
  created_at: string
  confirmed_at: string | null
}

export const TIP_PRESETS_MELO = [1, 5, 10, 25, 50] as const

export function formatMelo(amount: number): string {
  if (amount < 0.01) return `${amount.toFixed(6)} MELO`
  if (amount < 1) return `${amount.toFixed(4)} MELO`
  return `${amount.toFixed(2)} MELO`
}

export function tipStatusLabel(status: TipStatus): string {
  const labels: Record<TipStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    failed: 'Failed',
  }
  return labels[status]
}

export function isConfirmed(tip: Tip): boolean {
  return tip.status === 'confirmed'
}
