'use client'

import { STATUS_LABELS, STATUS_COLORS, formatEventTime, isUpcoming } from '@/lib/types/live-events'
import type { LiveEvent } from '@/lib/types/live-events'

interface Props {
  event: LiveEvent
  rsvpCount?: number
  onRsvp?: () => void
  isRsvping?: boolean
}

export function EventCard({ event, rsvpCount, onRsvp, isRsvping }: Props) {
  const statusColor = STATUS_COLORS[event.status]
  const statusLabel = STATUS_LABELS[event.status]

  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-4 space-y-3">
      {event.thumbnail_url && (
        <img src={event.thumbnail_url} alt={event.title} className="w-full h-40 object-cover rounded" />
      )}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
          style={{ color: event.status === 'live' ? '#030303' : statusColor, backgroundColor: event.status === 'live' ? statusColor : 'transparent', border: `1px solid ${statusColor}` }}
        >
          {statusLabel}
        </span>
        {event.points_reward > 0 && (
          <span className="text-xs text-[#c8f135]">+{event.points_reward} pts</span>
        )}
      </div>
      <h3 className="font-semibold text-white font-[Orbitron]">{event.title}</h3>
      {event.description && <p className="text-xs text-[#666]">{event.description}</p>}
      <div className="flex items-center justify-between text-xs text-[#555]">
        <span>{formatEventTime(event.scheduled_at)}</span>
        {rsvpCount !== undefined && <span>{rsvpCount} attending</span>}
      </div>
      {isUpcoming(event) && onRsvp && (
        <button
          onClick={onRsvp}
          disabled={isRsvping}
          className="w-full py-2 text-xs font-bold text-[#030303] bg-[#c8f135] rounded hover:bg-[#d4f54d] disabled:opacity-50 transition-colors"
        >
          {isRsvping ? 'Saving…' : 'RSVP'}
        </button>
      )}
    </div>
  )
}
