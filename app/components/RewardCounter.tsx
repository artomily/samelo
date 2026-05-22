'use client'

/**
 * RewardCounter - Displays the current pending reward amount
 * Shows animated counter with USD formatting
 */
interface RewardCounterProps {
  pendingCents: number
}

export function RewardCounter({ pendingCents }: RewardCounterProps) {
  const dollars = (pendingCents / 100).toFixed(2)

  return (
    <div className="flex items-center gap-2">
      <span className="font-display text-[9px] uppercase tracking-widest text-muted">Pending</span>
      <span
        key={pendingCents}
        className="animate-[fadeInUp_0.3s_ease-out] font-display text-sm font-black text-accent"
        style={{ textShadow: '0 0 10px rgba(200,241,53,0.5)' }}
      >
        ${dollars}
      </span>
    </div>
  )
}
