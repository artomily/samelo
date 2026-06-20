'use client'

import { useMyRank } from '@/hooks/useLeaderboardV2'
import { getMedalEmoji } from '@/lib/types/leaderboard'
import type { LeaderboardPeriod } from '@/lib/types/leaderboard'

interface Props {
  wallet: string
  period: LeaderboardPeriod
}

export function MyRankBanner({ wallet, period }: Props) {
  const { data, isLoading } = useMyRank(wallet, period)

  if (isLoading) return <div className="h-14 rounded-xl bg-white/5 animate-pulse" />
  if (!data?.rank) return null

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl border"
      style={{ borderColor: '#c8f13560', background: '#c8f13510' }}
    >
      <span className="text-xl">{getMedalEmoji(data.rank)}</span>
      <div className="flex-1">
        <p className="text-xs text-white/50">Your rank</p>
        <p className="text-sm font-semibold" style={{ color: '#c8f135' }}>
          #{data.rank}
        </p>
      </div>
      <p className="text-sm font-bold tabular-nums" style={{ color: '#c8f135' }}>
        {data.points.toLocaleString()} pts
      </p>
    </div>
  )
}
