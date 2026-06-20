'use client'
import { useWeeklyReward } from '@/hooks/useRewards'
import { Skeleton } from '@/components/ui/Skeleton'

export function WeeklyStats() {
  const { data, isLoading } = useWeeklyReward()
  const weekly = data?.weekly

  if (isLoading) return <Skeleton className="h-24 w-full rounded-xl" />

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
      <h3 className="text-sm font-semibold text-white/80 mb-3">This Week</h3>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="font-mono text-lg text-[#c8f135]">{(weekly?.total_points ?? 0).toLocaleString()}</p>
          <p className="text-xs text-white/40 mt-0.5">Points</p>
        </div>
        <div>
          <p className="font-mono text-lg text-[#c8f135]">{weekly?.streak_days ?? 0}</p>
          <p className="text-xs text-white/40 mt-0.5">Day Streak</p>
        </div>
        <div>
          <p className="font-mono text-lg text-[#c8f135]">
            {weekly?.rank ? `#${weekly.rank}` : '—'}
          </p>
          <p className="text-xs text-white/40 mt-0.5">Rank</p>
        </div>
      </div>
    </div>
  )
}
