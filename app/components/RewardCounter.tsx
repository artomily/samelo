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
      <span className="text-xs font-medium text-muted">Pending</span>
      <span
        key={pendingCents} // re-triggers animation on change
        className="animate-[fadeInUp_0.3s_ease-out] font-mono text-sm font-bold text-gold"
      >
        ${dollars}
      </span>
    </div>
  )
}
