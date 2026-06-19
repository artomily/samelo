import { useQuery } from '@tanstack/react-query'

interface PendingReward {
  id: string
  points: number
  source: 'watch' | 'quiz' | 'referral'
  createdAt: string
  videoTitle?: string
}

interface PendingRewardsResponse {
  rewards: PendingReward[]
  totalPending: number
}

async function fetchPending(walletAddress: string): Promise<PendingRewardsResponse> {
  const res = await fetch(`/api/rewards/pending?walletAddress=${walletAddress}`)
  if (!res.ok) throw new Error('Failed to fetch pending rewards')
  return res.json()
}

export function usePendingRewards(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ['pending-rewards', walletAddress],
    queryFn: () => fetchPending(walletAddress!),
    enabled: !!walletAddress,
    staleTime: 20_000,
  })
}
