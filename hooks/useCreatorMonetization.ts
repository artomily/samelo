import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreatorEarning, CreatorPayoutRequest } from '@/lib/types/creator-monetization'

interface EarningsResponse {
  earnings: CreatorEarning[]
  totalUnpaid: number
}

export function useCreatorEarnings(wallet: string | undefined) {
  return useQuery<EarningsResponse>({
    queryKey: ['creator-earnings', wallet],
    queryFn: async () => {
      const res = await fetch('/api/creator/earnings', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load earnings')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })
}

export function useCreatorPayouts(wallet: string | undefined) {
  return useQuery<{ payouts: CreatorPayoutRequest[] }>({
    queryKey: ['creator-payouts', wallet],
    queryFn: async () => {
      const res = await fetch('/api/creator/earnings?mode=payouts', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load payouts')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })
}

export function useRequestPayout(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (amountMelo: number) => {
      const res = await fetch('/api/creator/earnings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': wallet ?? '' },
        body: JSON.stringify({ amount_melo: amountMelo }),
      })
      if (!res.ok) throw new Error('Failed to request payout')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['creator-earnings', wallet] })
      qc.invalidateQueries({ queryKey: ['creator-payouts', wallet] })
    },
  })
}
