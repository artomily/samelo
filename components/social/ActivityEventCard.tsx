'use client'

import { ACTIVITY_ICONS, ACTIVITY_LABELS, type ActivityEvent } from '@/lib/types/social'
import { useReaction } from '@/hooks/useReactions'
import { formatDistanceToNow } from 'date-fns'

interface Props {
  event: ActivityEvent
  wallet: string | null
}

const EMOJIS = ['🔥', '👏', '💎', '🚀', '❤️']

export function ActivityEventCard({ event, wallet }: Props) {
  const { react } = useReaction(wallet)
  const icon = ACTIVITY_ICONS[event.eventType]
  const label = ACTIVITY_LABELS[event.eventType]

  return (
    <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
      <div className="flex items-start gap-3">
        <span className="text-lg">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm">
            <span className="font-mono text-[#c8f135] text-xs">{event.wallet.slice(0, 6)}…{event.wallet.slice(-4)}</span>
            {' '}{label}
          </p>
          {event.metadata?.title && (
            <p className="text-white/50 text-xs mt-0.5 truncate">{String(event.metadata.title)}</p>
          )}
          <p className="text-white/30 text-xs mt-1">
            {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {EMOJIS.map(emoji => (
          <button
            key={emoji}
            onClick={() => react.mutate({ eventId: event.id, emoji })}
            className="text-sm hover:scale-125 transition-transform active:scale-95"
            title={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
        {(event.reactionCount ?? 0) > 0 && (
          <span className="text-white/30 text-xs ml-auto">{event.reactionCount} reactions</span>
        )}
      </div>
    </div>
  )
}
