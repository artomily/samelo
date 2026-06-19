import { useQuery } from '@tanstack/react-query'

interface UserFlowData {
  wallet: string
  totalWatches: number
  totalPointsEarned: number
  totalPointsBurned: number
  totalMeloReceived: string
  currentPoints: number
  swapCount: number
  conversionRate: string
  recentSwaps: Array<{
    pointsBurned: number
    meloReceived: string
    txHash: string | null
    createdAt: string
  }>
}

async function fetchUserFlow(walletAddress: string): Promise<UserFlowData> {
  const res = await fetch(`/api/onchain/user-flow?walletAddress=${walletAddress}`)
  if (!res.ok) throw new Error('Failed to fetch user flow')
  return res.json()
}

export function useUserFlow(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ['user-flow', walletAddress],
    queryFn: () => fetchUserFlow(walletAddress!),
    enabled: !!walletAddress,
    staleTime: 60_000,
  })
}
