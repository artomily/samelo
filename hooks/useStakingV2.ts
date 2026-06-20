import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { StakingPosition, StakingTierV2 } from '@/lib/types/staking-v2'

interface PositionsResponse {
  positions: StakingPosition[]
}

export function useStakingPositions(wallet: string | undefined) {
  return useQuery<PositionsResponse>({
    queryKey: ['staking-v2', wallet],
    queryFn: async () => {
      const res = await fetch('/api/staking/v2', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load staking positions')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 30_000,
  })
}

export function useCreateStake(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<StakingPosition, Error, { amountMelo: number; tier: StakingTierV2; txHash?: string }>({
    mutationFn: async (body) => {
      const res = await fetch('/api/staking/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet ?? '',
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? 'Stake failed')
      }
      return (await res.json()).position
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['staking-v2', wallet] }),
  })
}

export function useUnstake(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<void, Error, { positionId: string }>({
    mutationFn: async ({ positionId }) => {
      const res = await fetch('/api/staking/v2/unstake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet ?? '',
        },
        body: JSON.stringify({ positionId }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? 'Unstake failed')
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['staking-v2', wallet] }),
  })
}
