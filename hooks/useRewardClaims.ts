import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { RewardClaimRequest, ClaimSource } from '@/lib/types/reward-claim'

interface ClaimsResponse {
  claims: RewardClaimRequest[]
  totalClaimable: number
}

export function useRewardClaims(wallet: string | undefined) {
  return useQuery<ClaimsResponse>({
    queryKey: ['reward-claims', wallet],
    queryFn: async () => {
      const res = await fetch('/api/rewards/claim', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load claims')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 30_000,
  })
}

export function useSubmitClaim(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { source: ClaimSource; amount_melo: number; reference_id?: string }) => {
      const res = await fetch('/api/rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': wallet ?? '' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to submit claim')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reward-claims', wallet] }),
  })
}
