'use client'

import { useFeed } from '@/hooks/useFeed'
import { ActivityEventCard } from './ActivityEventCard'

interface Props {
  wallet: string | null
}

export function ActivityFeed({ wallet }: Props) {
  const { data, isLoading } = useFeed(wallet)

  if (!wallet) {
    return <p className="text-white/40 text-center py-12">Connect wallet to see your feed</p>
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    )
  }

  const events = data?.events ?? []

  if (events.length === 0) {
    return (
      <div className="text-center py-12 space-y-2">
        <p className="text-white/40">No activity yet</p>
        <p className="text-white/20 text-sm">Follow others to see their activity here</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {events.map(event => (
        <ActivityEventCard key={event.id} event={event} wallet={wallet} />
      ))}
    </div>
  )
}
