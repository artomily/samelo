'use client'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import type { DailyMetrics } from '@/lib/analytics/aggregate'

interface MetricsResponse {
  metrics: DailyMetrics
  topVideos: { videoId: string; plays: number }[]
}

export function useAdminMetrics(date?: string) {
  const { address } = useAccount()

  return useQuery<MetricsResponse>({
    queryKey: ['admin-metrics', date],
    queryFn: async () => {
      const params = date ? `?date=${date}` : ''
      const res = await fetch(`/api/analytics/metrics${params}`, {
        headers: { 'x-wallet-address': address ?? '' },
      })
      if (!res.ok) throw new Error('Failed to fetch metrics')
      return res.json()
    },
    enabled: !!address,
    staleTime: 60_000,
  })
}
