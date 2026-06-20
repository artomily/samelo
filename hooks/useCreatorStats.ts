import { useQuery } from '@tanstack/react-query'
import type { CreatorDashboardStats } from '@/lib/types/creator'

export function useCreatorStats(wallet: string | undefined, days = 30) {
  return useQuery<{ stats: CreatorDashboardStats }>({
    queryKey: ['creator-stats', wallet, days],
    queryFn: async () => {
      const res = await fetch(`/api/creator/stats?days=${days}`, {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load creator stats')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 300_000,
  })
}
