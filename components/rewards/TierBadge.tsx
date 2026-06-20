'use client'
import { REWARD_TIERS, getTierForPoints } from '@/lib/types/rewards'

interface TierBadgeProps {
  points: number
  showProgress?: boolean
}

export function TierBadge({ points, showProgress = false }: TierBadgeProps) {
  const current = getTierForPoints(points)
  const currentIndex = REWARD_TIERS.findIndex(t => t.id === current.id)
  const next = REWARD_TIERS[currentIndex + 1]

  const progress = next
    ? Math.min((points - current.min_daily_points) / (next.min_daily_points - current.min_daily_points), 1)
    : 1

  return (
    <div className="inline-flex flex-col gap-1">
      <span className="inline-flex items-center gap-1 text-sm font-medium text-[#c8f135]">
        {current.badge_emoji} {current.name}
      </span>
      {showProgress && next && (
        <div className="flex items-center gap-2">
          <div className="h-1 w-20 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c8f135]"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <span className="text-xs text-white/30">
            {next.min_daily_points - points} pts to {next.badge_emoji} {next.name}
          </span>
        </div>
      )}
    </div>
  )
}
