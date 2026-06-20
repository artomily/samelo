'use client'
import { useDailyReward } from '@/hooks/useRewards'
import { Skeleton } from '@/components/ui/Skeleton'

export function DailyRewardCard() {
  const { reward, tier, isLoading } = useDailyReward()

  if (isLoading) {
    return <Skeleton className="h-28 w-full rounded-xl" />
  }

  const points = reward?.points_earned ?? 0
  const videos = reward?.videos_watched ?? 0
  const quizzes = reward?.quizzes_passed ?? 0

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/80">Today</h3>
        {tier && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#c8f135]/10 text-[#c8f135] font-mono">
            {tier.badge_emoji} {tier.name}
          </span>
        )}
      </div>

      <p className="font-display text-3xl text-[#c8f135] mb-3">
        {points.toLocaleString()} <span className="text-base text-white/40">pts</span>
      </p>

      <div className="flex gap-4 text-xs text-white/40">
        <span>▶ {videos} videos</span>
        <span>🧠 {quizzes} quizzes</span>
        {tier && tier.bonus_multiplier > 1 && (
          <span className="text-[#c8f135]">×{tier.bonus_multiplier} bonus</span>
        )}
      </div>
    </div>
  )
}
