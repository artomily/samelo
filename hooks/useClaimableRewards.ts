import { useQuery } from '@tanstack/react-query'

interface ClaimableRewards {
  unclaimedPoints: number
  estimatedCents: number
  canClaim: boolean
  minimumClaimPoints: number
}

async function fetchClaimable(walletAddress: string): Promise<ClaimableRewards> {
  const res = await fetch(`/api/rewards/claimable?walletAddress=${walletAddress}`)
  if (!res.ok) throw new Error('Failed to fetch claimable rewards')
  return res.json()
}

export function useClaimableRewards(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ['claimable-rewards', walletAddress],
    queryFn: () => fetchClaimable(walletAddress!),
    enabled: !!walletAddress,
    staleTime: 15_000,
    refetchInterval: 30_000,
  })
}
