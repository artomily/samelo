'use client'

import { useWalletEvents } from '@/hooks/useOnchainEvents'
import { OnchainEventRow } from './OnchainEventRow'

interface Props {
  wallet: string
  eventName?: string
  title?: string
}

export function OnchainEventFeed({ wallet, eventName, title = 'On-chain Activity' }: Props) {
  const { data, isLoading } = useWalletEvents(wallet, eventName)

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">{title}</h2>

      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && !data?.events?.length && (
        <p className="text-white/30 text-sm">No on-chain events found.</p>
      )}

      {data?.events && (
        <div className="space-y-2">
          {data.events.map((ev) => (
            <OnchainEventRow key={ev.id} event={ev} />
          ))}
        </div>
      )}
    </div>
  )
}
