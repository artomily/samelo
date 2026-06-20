'use client'

import type { SwapHistory } from '@/lib/types/swap'
import { CeloscanTxLink } from '@/components/celo/CeloscanLink'

interface Props {
  swap: SwapHistory
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#c8f135',
  failed: '#ef4444',
}

export function SwapHistoryRow({ swap }: Props) {
  const color = STATUS_COLORS[swap.status] ?? '#ffffff'
  const date = new Date(swap.created_at).toLocaleDateString()

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5">
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-sm font-medium">
          {swap.amount_in.toFixed(4)} {swap.token_in.slice(0, 6)}
          <span className="text-white/40 mx-1">→</span>
          {swap.amount_out.toFixed(4)} {swap.token_out.slice(0, 6)}
        </p>
        <p className="text-xs text-white/40">{date}</p>
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{swap.status}</span>
      <CeloscanTxLink txHash={swap.tx_hash} chainId={42220} />
    </div>
  )
}
