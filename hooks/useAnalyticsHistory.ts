import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

export interface DayData {
  date: string
  watches: number
  points: number
}

async function fetchHistory(wallet: string, days: number): Promise<{ timeline: DayData[]; days: number }> {
  const res = await fetch(`/api/analytics/history?wallet=${wallet}&days=${days}`)
  if (!res.ok) throw new Error('Failed to fetch history')
  return res.json()
}

export function useAnalyticsHistory(days: 7 | 14 | 30 = 30) {
  const { address } = useAccount()
  return useQuery({
    queryKey: ['analytics-history', address, days],
    queryFn: () => fetchHistory(address!, days),
    enabled: !!address,
    staleTime: 300_000,
  })
}
