import { useQuery } from '@tanstack/react-query'
import type { TreasuryMetrics } from '@/lib/types/onchain'

async function fetchTreasury(): Promise<TreasuryMetrics> {
  const res = await fetch('/api/onchain/treasury')
  if (!res.ok) throw new Error('Failed to fetch treasury metrics')
  return res.json()
}

export function useTreasuryMetrics() {
  return useQuery({
    queryKey: ['treasury-metrics'],
    queryFn: fetchTreasury,
    staleTime: 60_000,
    refetchInterval: 120_000,
  })
}
