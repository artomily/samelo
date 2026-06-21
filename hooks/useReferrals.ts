import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ReferralCode, ReferralConversion } from '@/lib/types/referrals'

export function useMyReferral(wallet?: string) {
  return useQuery({
    queryKey: ['referral', wallet],
    queryFn: async () => {
      const res = await fetch('/api/referrals', {
        headers: { 'x-wallet-address': wallet! },
      })
      if (!res.ok) throw new Error('Failed to fetch referral')
      return res.json() as Promise<{ referral: ReferralCode; conversions: ReferralConversion[] }>
    },
    enabled: !!wallet,
  })
}

export function useLookupReferralCode(code?: string) {
  return useQuery({
    queryKey: ['referral-code', code],
    queryFn: async () => {
      const res = await fetch(`/api/referrals?code=${code}`)
      if (!res.ok) return null
      const data = await res.json()
      return data.referral as ReferralCode
    },
    enabled: !!code && code.length >= 4,
  })
}

export function useApplyReferral(wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify({ code }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed to apply referral')
      }
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['referral', wallet] }),
  })
}
