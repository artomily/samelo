import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

export interface PersonalStats {
  totalWatches: number
  totalQuizzes: number
  totalReferrals: number
  totalPointsEarned: number
  totalPointsBurned: number
  totalMeloEarned: number
  currentStreak: number
  longestStreak: number
  xp: number
  level: number
  daysSinceJoined: number
  avgPointsPerDay: number
}

async function fetchPersonalStats(wallet: string): Promise<PersonalStats> {
  const res = await fetch(`/api/analytics/personal?wallet=${wallet}`)
  if (!res.ok) throw new Error('Failed to fetch analytics')
  return res.json()
}

export function usePersonalAnalytics() {
  const { address } = useAccount()
  return useQuery({
    queryKey: ['personal-analytics', address],
    queryFn: () => fetchPersonalStats(address!),
    enabled: !!address,
    staleTime: 60_000,
    refetchInterval: 120_000,
  })
}
