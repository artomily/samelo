import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ReferralCode } from '@/lib/types/referral'

export function useReferralCode(wallet: string | undefined) {
  return useQuery<{ code: ReferralCode }>({
    queryKey: ['referral-code-v2', wallet],
    queryFn: async () => {
      const res = await fetch('/api/referral/code', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load referral code')
      return res.json()
    },
    enabled: !!wallet && /^0x[0-9a-fA-F]{40}$/.test(wallet),
    staleTime: Infinity,
  })
}

export function useApplyReferral(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<{ bonusPoints: number }, Error, { code: string }>({
    mutationFn: async ({ code }) => {
      const res = await fetch('/api/referral/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet ?? '',
        },
        body: JSON.stringify({ code }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? 'Failed to apply code')
      }
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['referral-code-v2', wallet] })
    },
  })
}
