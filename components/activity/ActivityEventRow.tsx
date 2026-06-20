'use client'

import { ACTIVITY_ICONS, activityLabel } from '@/lib/types/activity-feed'
import type { ActivityEvent } from '@/lib/types/activity-feed'

interface Props {
  event: ActivityEvent
}

function timeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function ActivityEventRow({ event }: Props) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[#111] last:border-0">
      <span className="text-base w-6 text-center flex-shrink-0">{ACTIVITY_ICONS[event.event_type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#ccc]">{activityLabel(event)}</p>
        <p className="text-xs text-[#555] font-mono mt-0.5">
          {event.wallet.slice(0, 6)}…{event.wallet.slice(-4)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
        {event.points_delta !== 0 && (
          <span className={`text-xs font-bold ${event.points_delta > 0 ? 'text-[#c8f135]' : 'text-red-400'}`}>
            {event.points_delta > 0 ? '+' : ''}{event.points_delta}
          </span>
        )}
        <span className="text-[10px] text-[#444]">{timeAgo(event.created_at)}</span>
      </div>
    </div>
  )
}
