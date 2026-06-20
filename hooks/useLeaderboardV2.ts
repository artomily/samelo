import { useQuery } from '@tanstack/react-query'
import type { LeaderboardEntry, LeaderboardPeriod } from '@/lib/types/leaderboard'

interface LeaderboardResponse {
  period: LeaderboardPeriod
  entries: LeaderboardEntry[]
}

interface RankResponse {
  rank: number | null
  points: number
}

export function useLeaderboard(period: LeaderboardPeriod, limit = 50) {
  return useQuery<LeaderboardResponse>({
    queryKey: ['leaderboard-v2', period, limit],
    queryFn: async () => {
      const res = await fetch(`/api/leaderboard?period=${period}&limit=${limit}`)
      if (!res.ok) throw new Error('Failed to load leaderboard')
      return res.json()
    },
    staleTime: 60_000,
  })
}

export function useMyRank(wallet: string | undefined, period: LeaderboardPeriod) {
  return useQuery<RankResponse>({
    queryKey: ['leaderboard-rank', wallet, period],
    queryFn: async () => {
      const res = await fetch(`/api/leaderboard/rank?period=${period}`, {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load rank')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })
}
