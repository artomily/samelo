import { useQuery } from '@tanstack/react-query'
import type { RewardDistribution } from '@/lib/types/leaderboard-rewards'

interface RewardsResponse {
  rewards: RewardDistribution[]
  totalUnclaimed: number
}

export function useWalletRewards(wallet: string | undefined) {
  return useQuery<RewardsResponse>({
    queryKey: ['leaderboard-rewards', wallet],
    queryFn: async () => {
      const res = await fetch('/api/rewards', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load rewards')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 120_000,
  })
}
