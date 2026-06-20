import { useQuery } from '@tanstack/react-query'
import type { OnchainRewardQueue } from '@/lib/types/onchain-rewards-v2'

export function useOnchainRewardQueue(wallet: string | undefined) {
  return useQuery<{ rewards: OnchainRewardQueue[] }>({
    queryKey: ['onchain-rewards-v2', wallet],
    queryFn: async () => {
      const res = await fetch('/api/rewards/onchain', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load reward queue')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 30_000,
    refetchInterval: 30_000,
  })
}
