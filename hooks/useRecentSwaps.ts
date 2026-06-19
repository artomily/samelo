import { useQuery } from '@tanstack/react-query'
import type { RecentSwap } from '@/lib/types/onchain'

async function fetchRecentSwaps(): Promise<RecentSwap[]> {
  const res = await fetch('/api/onchain/recent-swaps')
  if (!res.ok) throw new Error('Failed to fetch recent swaps')
  const json = await res.json()
  return json.swaps
}

export function useRecentSwaps() {
  return useQuery({
    queryKey: ['recent-swaps'],
    queryFn: fetchRecentSwaps,
    staleTime: 30_000,
    refetchInterval: 30_000,
  })
}
