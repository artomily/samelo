'use client'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import type { DailyReward, WeeklyReward } from '@/lib/types/rewards'
import { getTierForPoints } from '@/lib/types/rewards'

export function useDailyReward() {
  const { address } = useAccount()

  const query = useQuery<{ reward: DailyReward | null }>({
    queryKey: ['daily-reward', address],
    queryFn: async () => {
      if (!address) return { reward: null }
      const res = await fetch(`/api/rewards/daily?wallet=${address}`)
      if (!res.ok) throw new Error('Failed to fetch daily reward')
      return res.json()
    },
    enabled: !!address,
    staleTime: 60_000,
  })

  const reward = query.data?.reward
  const tier = reward ? getTierForPoints(reward.points_earned) : null

  return { reward, tier, ...query }
}

export function useWeeklyReward() {
  const { address } = useAccount()

  return useQuery<{ weekly: WeeklyReward | null }>({
    queryKey: ['weekly-reward', address],
    queryFn: async () => {
      if (!address) return { weekly: null }
      const res = await fetch(`/api/rewards/weekly?wallet=${address}`)
      if (!res.ok) throw new Error('Failed to fetch weekly reward')
      return res.json()
    },
    enabled: !!address,
    staleTime: 60_000,
  })
}
