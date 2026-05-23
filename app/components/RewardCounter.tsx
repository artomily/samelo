'use client'

/**
 * RewardCounter - Displays the current pending reward amount in points
 * Shows animated counter with point formatting
 */
interface RewardCounterProps {
  pendingCents: number
}

export function RewardCounter({ pendingCents }: RewardCounterProps) {
  const points = pendingCents

  return (
    <div className="flex items-center gap-2">
      <span className="font-display text-[9px] uppercase tracking-widest text-muted">Pending</span>
      <span
        key={pendingCents}
        className="animate-[fadeInUp_0.3s_ease-out] font-display text-sm font-black text-accent"
        style={{ textShadow: '0 0 10px rgba(200,241,53,0.5)' }}
      >
        {points}p
      </span>
    </div>
  )
}
