import { useQuery } from '@tanstack/react-query'
import type { PointsHistoryEntry, PointsSource } from '@/lib/types/points-history'

interface PointsHistoryResponse {
  history: PointsHistoryEntry[]
  totals: Record<PointsSource, number>
}

export function usePointsHistory(wallet: string | undefined, source?: PointsSource, limit = 50) {
  return useQuery<PointsHistoryResponse>({
    queryKey: ['points-history', wallet, source, limit],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: String(limit) })
      if (source) params.set('source', source)
      const res = await fetch(`/api/points/history?${params}`, {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load points history')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })
}
