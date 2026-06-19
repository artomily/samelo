import { useQuery } from '@tanstack/react-query'

interface RewardsBalance {
  totalPoints: number
  totalEarnedCents: number
  unclaimedPoints: number
}

async function fetchBalance(walletAddress: string): Promise<RewardsBalance> {
  const res = await fetch(`/api/rewards/balance?walletAddress=${walletAddress}`)
  if (!res.ok) throw new Error('Failed to fetch balance')
  return res.json()
}

export function useRewardsBalance(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ['rewards-balance', walletAddress],
    queryFn: () => fetchBalance(walletAddress!),
    enabled: !!walletAddress,
    staleTime: 15_000,
    refetchInterval: 30_000,
  })
}
