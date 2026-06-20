import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { SubscriptionTier, UserSubscriptionWithTier, SubscriptionPeriod } from '@/lib/types/subscription'

interface SubscriptionsResponse {
  tiers: SubscriptionTier[]
  active: UserSubscriptionWithTier | null
}

export function useSubscriptions(wallet: string | undefined) {
  return useQuery<SubscriptionsResponse>({
    queryKey: ['subscriptions', wallet],
    queryFn: async () => {
      const res = await fetch('/api/subscriptions', {
        headers: wallet ? { 'x-wallet-address': wallet } : {},
      })
      if (!res.ok) throw new Error('Failed to load subscriptions')
      return res.json()
    },
    staleTime: 60_000,
  })
}

export function useSubscribe(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { tier_id: string; period: SubscriptionPeriod; tx_hash?: string }) => {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': wallet ?? '' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to subscribe')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscriptions', wallet] }),
  })
}
