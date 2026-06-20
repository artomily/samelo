'use client'

import { EVENT_LABELS } from '@/lib/types/onchain-event'
import type { OnchainEvent } from '@/lib/types/onchain-event'
import { CeloscanTxLink } from '@/components/celo/CeloscanLink'

interface Props {
  event: OnchainEvent
}

export function OnchainEventRow({ event }: Props) {
  const label = EVENT_LABELS[event.event_name as keyof typeof EVENT_LABELS] ?? event.event_name
  const date = new Date(event.created_at).toLocaleDateString()

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{label}</p>
        <p className="text-xs text-white/40">Block #{event.block_number} · {date}</p>
      </div>
      <CeloscanTxLink txHash={event.tx_hash} chainId={event.chain_id} />
    </div>
  )
}
