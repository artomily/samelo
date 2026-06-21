'use client'

import { useWatchStreak } from '@/hooks/useWatchStreak'
import { isStreakActive, nextMilestone, daysToNextMilestone } from '@/lib/types/watch-streaks'

interface Props {
  wallet: string
}

export function StreakBadge({ wallet }: Props) {
  const { data } = useWatchStreak(wallet)
  const streak = data?.streak

  if (!streak || streak.current_streak === 0) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-[#555]">
        <span>🔥</span>
        <span>No streak yet</span>
      </div>
    )
  }

  const active = isStreakActive(streak)
  const next = nextMilestone(streak)
  const days = daysToNextMilestone(streak)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className={`text-xl ${active ? '' : 'opacity-40'}`}>🔥</span>
        <span className={`text-2xl font-bold font-mono ${active ? 'text-[#c8f135]' : 'text-[#666]'}`}>
          {streak.current_streak}
        </span>
        <span className="text-sm text-[#888]">day streak</span>
        {!active && <span className="text-xs text-[#f13535]">paused</span>}
      </div>

      {next !== null && (
        <div className="flex items-center gap-2 text-xs text-[#666]">
          <div className="h-1 flex-1 rounded-full bg-[#1a1a1a]">
            <div
              className="h-1 rounded-full bg-[#c8f135]"
              style={{ width: `${((streak.current_streak / next) * 100).toFixed(1)}%` }}
            />
          </div>
          <span>{days} day{days !== 1 ? 's' : ''} to {next}-day milestone</span>
        </div>
      )}
    </div>
  )
}
