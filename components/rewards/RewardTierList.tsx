'use client'
import { REWARD_TIERS } from '@/lib/types/rewards'
import { useDailyReward } from '@/hooks/useRewards'

export function RewardTierList() {
  const { reward } = useDailyReward()
  const currentPoints = reward?.points_earned ?? 0

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-3">Reward Tiers</h3>
      {REWARD_TIERS.map((tier, i) => {
        const isActive = currentPoints >= tier.min_daily_points
        const isCurrentTier = (() => {
          const next = REWARD_TIERS[i + 1]
          return isActive && (!next || currentPoints < next.min_daily_points)
        })()

        return (
          <div
            key={tier.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              isCurrentTier ? 'bg-[#c8f135]/10 border border-[#c8f135]/30' : 'bg-white/3'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={isActive ? '' : 'grayscale opacity-40'}>{tier.badge_emoji}</span>
              <div>
                <p className={`text-sm font-medium ${isCurrentTier ? 'text-[#c8f135]' : isActive ? 'text-white' : 'text-white/40'}`}>
                  {tier.name}
                </p>
                <p className="text-xs text-white/30">{tier.min_daily_points}+ pts / day</p>
              </div>
            </div>
            <span className={`text-sm font-mono ${isActive ? 'text-[#c8f135]' : 'text-white/20'}`}>
              ×{tier.bonus_multiplier}
            </span>
          </div>
        )
      })}
    </div>
  )
}
