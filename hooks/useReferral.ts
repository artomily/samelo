import { useState, useEffect, useCallback } from 'react'

export interface ReferralData {
  referralCode: string
  referredBy: string | null
  referralCount: number
  totalRewardPoints: number
  referrals: Array<{
    referred_wallet: string
    reward_points: number
    created_at: string
  }>
}

export function useReferral(walletAddress: string | undefined) {
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReferral = useCallback(async () => {
    if (!walletAddress) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/referral?walletAddress=${walletAddress}`)
      const json = await res.json()
      if (json.referralCode) setData(json)
      else setError(json.error ?? 'Failed to load referral data')
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }, [walletAddress])

  useEffect(() => {
    fetchReferral()
  }, [fetchReferral])

  const copyReferralLink = useCallback(async (): Promise<boolean> => {
    if (!data?.referralCode) return false
    const link = `${window.location.origin}?ref=${data.referralCode}`
    try {
      await navigator.clipboard.writeText(link)
      return true
    } catch {
      return false
    }
  }, [data])

  const shareReferralLink = useCallback(async (): Promise<boolean> => {
    if (!data?.referralCode) return false
    const link = `${window.location.origin}?ref=${data.referralCode}`
    if (typeof navigator.share !== 'undefined') {
      try {
        await navigator.share({ title: 'Join Samelo', url: link })
        return true
      } catch {
        return false
      }
    }
    return copyReferralLink()
  }, [data, copyReferralLink])

  const redeemCode = useCallback(async (code: string): Promise<{ success: boolean; error?: string }> => {
    if (!walletAddress) return { success: false, error: 'Not connected' }
    try {
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, referralCode: code.trim() }),
      })
      const json = await res.json()
      if (res.ok) {
        await fetchReferral()
        return { success: true }
      }
      return { success: false, error: json.error }
    } catch {
      return { success: false, error: 'Network error' }
    }
  }, [walletAddress, fetchReferral])

  return { data, loading, error, refetch: fetchReferral, copyReferralLink, shareReferralLink, redeemCode }
}
