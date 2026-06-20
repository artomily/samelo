'use client'

import { useActivityFeed } from '@/hooks/useActivityFeed'
import { ActivityEventRow } from './ActivityEventRow'

type FeedMode = 'public' | 'following' | 'wallet'

interface Props {
  mode?: FeedMode
  wallet?: string
}

export function ActivityFeedList({ mode = 'public', wallet }: Props) {
  const { data, isLoading } = useActivityFeed(mode, wallet)

  if (isLoading) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-12 bg-[#0d0d0d] rounded animate-pulse" />
        ))}
      </div>
    )
  }

  const events = data?.events ?? []

  if (events.length === 0) {
    return <p className="text-xs text-[#555] text-center py-8">No activity yet</p>
  }

  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg divide-y divide-[#111] px-4">
      {events.map((event) => (
        <ActivityEventRow key={event.id} event={event} />
      ))}
    </div>
  )
}
