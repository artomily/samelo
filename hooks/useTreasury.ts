import { useQuery } from '@tanstack/react-query'
import type { TreasuryTransaction, TreasurySnapshot } from '@/lib/types/dao-treasury'

interface TreasuryResponse {
  transactions: TreasuryTransaction[]
  snapshot: TreasurySnapshot | null
}

export function useTreasury() {
  return useQuery<TreasuryResponse>({
    queryKey: ['treasury'],
    queryFn: async () => {
      const res = await fetch('/api/treasury')
      if (!res.ok) throw new Error('Failed to load treasury data')
      return res.json()
    },
    staleTime: 300_000,
    refetchInterval: 300_000,
  })
}
