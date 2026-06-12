'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { toast } from '@/app/components/Toast'

export interface ReferralEntry {
  referred_wallet: string
  reward_points: number
  created_at: string
}

export interface ReferralData {
  referralCode: string
  referredBy: string | null
  referralCount: number
  totalRewardPoints: number
  referrals: ReferralEntry[]
}

export function useReferral() {
  const { address } = useAccount()
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [redeeming, setRedeeming] = useState(false)
  const [redeemCode, setRedeemCode] = useState('')
  const [redeemError, setRedeemError] = useState<string | null>(null)
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null)

  const fetchReferralData = useCallback(async (walletAddress: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/referral?walletAddress=${walletAddress}`)
      const data = await res.json() as ReferralData
      if (data.referralCode) setReferralData(data)
    } catch {
      // Silently fail — UI shows fallback
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch referral data when address changes
  useEffect(() => {
    if (!address) {
      setReferralData(null)
      return
    }
    fetchReferralData(address)
  }, [address, fetchReferralData])

  // Check localStorage for stored referral code (from URL param)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('samelo_ref_code')
      if (stored) {
        setRedeemCode(stored)
      }
    } catch {
      // Ignore
    }
  }, [])

  const copyReferralLink = useCallback(async () => {
    if (!referralData?.referralCode) return
    const link = `${window.location.origin}?ref=${referralData.referralCode}`
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      toast('Link copied!', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback — try old API
      toast('Could not copy — try manually', 'error')
    }
  }, [referralData?.referralCode])

  const shareReferralLink = useCallback(async () => {
    if (!referralData?.referralCode) return
    const link = `${window.location.origin}?ref=${referralData.referralCode}`
    const text = `Watch videos & earn CELO on Samelo! Use my referral code: ${referralData.referralCode}\n\n${link}`

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Samelo — Watch & Earn', text, url: link })
        toast('Shared!', 'success')
        return
      } catch (err) {
        if ((err as DOMException).name === 'AbortError') return
      }
    }

    // Fallback to copy
    await copyReferralLink()
  }, [referralData?.referralCode, copyReferralLink])

  const redeemReferralCode = useCallback(async (
    walletAddress: string,
    code: string,
  ) => {
    setRedeeming(true)
    setRedeemError(null)
    setRedeemSuccess(null)

    try {
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, referralCode: code.trim() }),
      })
      const data = await res.json() as {
        success?: boolean
        error?: string
        alreadyReferred?: boolean
        rewardPoints?: number
      }

      if (res.ok && data.success) {
        const msg = data.rewardPoints
          ? `Referral redeemed! +${data.rewardPoints} bonus pts`
          : 'Referral redeemed!'
        setRedeemSuccess(msg)
        toast(msg, 'success')
        setRedeemCode('')
        try { localStorage.removeItem('samelo_ref_code') } catch {}
        // Refresh referral data
        await fetchReferralData(walletAddress)
        return true
      }

      setRedeemError(data.error ?? 'Failed to redeem code')
      toast(data.error ?? 'Failed to redeem code', 'error')
      return false
    } catch {
      const msg = 'Network error'
      setRedeemError(msg)
      toast(msg, 'error')
      return false
    } finally {
      setRedeeming(false)
    }
  }, [fetchReferralData])

  // Auto-redeem stored referral code when wallet connects
  useEffect(() => {
    if (!address) return
    try {
      const stored = localStorage.getItem('samelo_ref_code')
      if (!stored) return
      // Only auto-redeem if we haven't already been referred
      if (referralData && referralData.referredBy) {
        localStorage.removeItem('samelo_ref_code')
        return
      }
      // Small delay to ensure profile is loaded
      const timer = setTimeout(() => {
        redeemReferralCode(address, stored)
      }, 1000)
      return () => clearTimeout(timer)
    } catch {
      // Ignore
    }
  }, [address, referralData, redeemReferralCode])

  return {
    referralData,
    loading,
    copied,
    copyReferralLink,
    shareReferralLink,
    redeeming,
    redeemCode,
    setRedeemCode,
    redeemError,
    redeemSuccess,
    redeemReferralCode,
    clearRedeemState: () => {
      setRedeemError(null)
      setRedeemSuccess(null)
    },
  }
}