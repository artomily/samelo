import { useQuery } from '@tanstack/react-query'

type SortBy = 'points' | 'watches'
type Period = 'all_time' | 'weekly' | 'monthly'

interface LeaderboardEntry {
  wallet_address: string
  display_name: string | null
  total_points: number
  total_watches: number
  rank: number
}

interface LeaderboardResponse {
  entries: LeaderboardEntry[]
  period: Period
  sortBy: SortBy
}

async function fetchLeaderboard(period: Period, sortBy: SortBy): Promise<LeaderboardResponse> {
  const res = await fetch(`/api/leaderboard?period=${period}&sortBy=${sortBy}`)
  if (!res.ok) throw new Error('Failed to fetch leaderboard')
  return res.json()
}

export function useLeaderboard(period: Period = 'all_time', sortBy: SortBy = 'points') {
  return useQuery({
    queryKey: ['leaderboard', period, sortBy],
    queryFn: () => fetchLeaderboard(period, sortBy),
    staleTime: 60_000,
  })
}
