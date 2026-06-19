import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import type { StakePosition } from '@/lib/types/staking'

async function fetchPositions(wallet: string): Promise<{ positions: StakePosition[] }> {
  const res = await fetch(`/api/staking/positions?wallet=${wallet}`)
  if (!res.ok) throw new Error('Failed to fetch stake positions')
  return res.json()
}

async function fetchMultiplier(wallet: string): Promise<{ multiplier: number; activeStakes: number }> {
  const res = await fetch(`/api/staking/multiplier?wallet=${wallet}`)
  if (!res.ok) throw new Error('Failed to fetch multiplier')
  return res.json()
}

export function useStakePositions() {
  const { address } = useAccount()
  return useQuery({
    queryKey: ['stake-positions', address],
    queryFn: () => fetchPositions(address!),
    enabled: !!address,
    staleTime: 60_000,
  })
}

export function useStakeMultiplier() {
  const { address } = useAccount()
  return useQuery({
    queryKey: ['stake-multiplier', address],
    queryFn: () => fetchMultiplier(address!),
    enabled: !!address,
    staleTime: 120_000,
  })
}

export function useCreateStake() {
  const { address } = useAccount()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { amountMelo: string; lockDays: number; txHash?: string }) =>
      fetch('/api/staking/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: address, ...payload }),
      }).then(r => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stake-positions', address] })
      qc.invalidateQueries({ queryKey: ['stake-multiplier', address] })
    },
  })
}
