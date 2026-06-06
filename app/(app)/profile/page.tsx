'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'
import { useMiniPay } from '@/hooks/useMiniPay'
import { useAccount } from 'wagmi'
import { Share2, Copy, Users, Gift, Check, Loader2, Link2, Trophy } from 'lucide-react'
import Link from 'next/link'

interface ReferralData {
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

function shortenWallet(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const { isConnected, address, connectMiniPay, isConnecting } = useMiniPay()
  const { address: wagmiAddress } = useAccount()

  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [refLoading, setRefLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [redeeming, setRedeeming] = useState(false)
  const [redeemCode, setRedeemCode] = useState('')
  const [redeemError, setRedeemError] = useState<string | null>(null)
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null)

  const userAddr = address ?? wagmiAddress

  useEffect(() => {
    if (!userAddr) {
      setReferralData(null)
      return
    }
    setRefLoading(true)
    fetch(`/api/referral?walletAddress=${userAddr}`)
      .then((r) => r.json())
      .then((d: ReferralData) => {
        if (d.referralCode) setReferralData(d)
      })
      .catch(() => {})
      .finally(() => setRefLoading(false))
  }, [userAddr])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('samelo_ref_code')
      if (stored) {
        setRedeemCode(stored)
        localStorage.removeItem('samelo_ref_code')
      }
    } catch {
      // Ignore
    }
  }, [])

  async function handleCopyCode() {
    if (!referralData?.referralCode) return
    const referralLink = `${window.location.origin}?ref=${referralData.referralCode}`
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: just select text
    }
  }

  async function handleRedeem() {
    if (!userAddr || !redeemCode.trim()) return
    setRedeeming(true)
    setRedeemError(null)
    setRedeemSuccess(null)

    try {
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: userAddr, referralCode: redeemCode.trim() }),
      })
      const data = await res.json() as {
        success?: boolean
        error?: string
        alreadyReferred?: boolean
        rewardPoints?: number
      }

      if (res.ok && data.success) {
        setRedeemSuccess('Code redeemed! You earned 50 bonus points.')
        setRedeemCode('')
        // Refresh referral data
        if (userAddr) {
          const refRes = await fetch(`/api/referral?walletAddress=${userAddr}`)
          const refData = await refRes.json() as ReferralData
          if (refData.referralCode) setReferralData(refData)
        }
      } else {
        setRedeemError(data.error ?? 'Failed to redeem code')
      }
    } catch {
      setRedeemError('Network error')
    } finally {
      setRedeeming(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#030303] text-primary">
      {/* Header */}
      <header
        className="sticky top-0 left-0 right-0 z-30 flex items-center border-b border-[rgba(200,241,53,0.10)] px-4 py-3 sm:px-7 sm:py-3.5"
        style={{ background: 'rgba(3,3,3,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <h1 className="font-display text-[13px] font-black uppercase tracking-[0.15em] text-primary"
          style={{ textShadow: '0 0 10px rgba(200,241,53,0.2)' }}>
          Profile
        </h1>
      </header>

      <div className="w-full overflow-hidden px-4 py-4 pb-20 sm:px-7 sm:py-5">
        {isConnected ? (
          <div className="flex flex-col gap-4">
            {/* Wallet card */}
            <div className="rounded-2xl border border-[rgba(200,241,53,0.12)] bg-[#0d0d0d] p-5">
              <p className="mb-1 font-display text-[9px] uppercase tracking-widest text-muted">Wallet</p>
              <p className="break-all font-mono text-sm text-primary">{address}</p>
            </div>

            {/* Referral section */}
            <div className="rounded-2xl border border-[rgba(200,241,53,0.12)] bg-[#0d0d0d] overflow-hidden">
              <div className="border-b border-[rgba(200,241,53,0.08)] px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-accent" />
                  <p className="font-display text-[11px] font-bold uppercase tracking-wider text-accent">
                    Referral Program
                  </p>
                </div>

                {refLoading ? (
                  <div className="flex items-center gap-2 py-2">
                    <Loader2 size={14} className="animate-spin text-muted" />
                    <span className="text-xs text-muted">Loading...</span>
                  </div>
                ) : referralData ? (
                  <>
                    {/* Referral code + copy */}
                    <div className="mb-3 rounded-xl border border-[rgba(200,241,53,0.15)] bg-[rgba(200,241,53,0.04)] p-3">
                      <p className="mb-2 font-display text-[8px] uppercase tracking-widest text-muted">
                        Your Referral Code
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="flex-1 font-mono text-lg font-black tracking-wider text-accent">
                          {referralData.referralCode}
                        </p>
                        <button
                          onClick={handleCopyCode}
                          className="flex items-center gap-1.5 rounded-lg border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.08)] px-3 py-1.5 text-[10px] font-bold text-accent transition-all hover:border-[rgba(200,241,53,0.4)]"
                        >
                          {copied ? <Check size={12} /> : <Copy size={12} />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="mt-2 text-[9px] text-muted/60">
                        Share this code — earn 50 pts per friend
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="rounded-lg border border-[rgba(200,241,53,0.1)] bg-[rgba(200,241,53,0.02)] p-2.5 text-center">
                        <p className="font-display text-xl font-black tabular-nums text-primary">
                          {referralData.referralCount}
                        </p>
                        <p className="font-display text-[8px] uppercase tracking-widest text-muted">Referrals</p>
                      </div>
                      <div className="rounded-lg border border-[rgba(200,241,53,0.1)] bg-[rgba(200,241,53,0.02)] p-2.5 text-center">
                        <p className="font-display text-xl font-black tabular-nums text-accent">
                          {referralData.totalRewardPoints}
                        </p>
                        <p className="font-display text-[8px] uppercase tracking-widest text-muted">Points Earned</p>
                      </div>
                    </div>

                    {/* Referral list */}
                    {referralData.referrals.length > 0 && (
                      <div>
                        <p className="mb-1.5 font-display text-[8px] uppercase tracking-widest text-muted">
                          Recent Referrals
                        </p>
                        <div className="space-y-1">
                          {referralData.referrals.slice(0, 5).map((ref, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-md bg-[rgba(200,241,53,0.03)] px-2.5 py-1.5"
                            >
                              <span className="font-mono text-[10px] text-primary">
                                {shortenWallet(ref.referred_wallet)}
                              </span>
                              <span className="font-display text-[10px] font-bold text-accent">
                                +{ref.reward_points} pts
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Redeem a code (if not already referred) */}
                    {!referralData.referredBy ? (
                      <div className="mt-3 border-t border-[rgba(200,241,53,0.08)] pt-3">
                        <p className="mb-2 font-display text-[8px] uppercase tracking-widest text-muted">
                          Have a referral code?
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={redeemCode}
                            onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                            placeholder="Enter code"
                            maxLength={8}
                            className="flex-1 rounded-lg border border-[rgba(200,241,53,0.15)] bg-[rgba(200,241,53,0.04)] px-3 py-2 font-mono text-xs text-primary placeholder:text-muted/40 focus:border-[rgba(200,241,53,0.4)] focus:outline-none"
                          />
                          <button
                            onClick={handleRedeem}
                            disabled={redeeming || !redeemCode.trim()}
                            className="rounded-lg border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.08)] px-4 py-2 font-display text-[10px] font-bold uppercase tracking-wider text-accent transition-all hover:border-[rgba(200,241,53,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {redeeming ? <Loader2 size={12} className="animate-spin" /> : 'Redeem'}
                          </button>
                        </div>
                        {redeemError && (
                          <p className="mt-1.5 text-[9px] text-red-400">{redeemError}</p>
                        )}
                        {redeemSuccess && (
                          <p className="mt-1.5 text-[9px] text-accent">{redeemSuccess}</p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 border-t border-[rgba(200,241,53,0.08)] pt-3">
                        <div className="flex items-center gap-2 rounded-md bg-[rgba(200,241,53,0.04)] px-2.5 py-1.5">
                          <Gift size={12} className="text-accent" />
                          <span className="text-[10px] text-muted">Referred by {shortenWallet(referralData.referredBy)}</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-[10px] text-muted">Unable to load referral data</p>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl border border-[rgba(200,241,53,0.12)] bg-[#0d0d0d] divide-y divide-[rgba(200,241,53,0.06)] overflow-hidden">
              <Link
                href="/leaderboard"
                className="flex items-center justify-between px-5 py-4 text-sm text-primary hover:bg-[rgba(200,241,53,0.04)] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Trophy size={14} className="text-amber-400" />
                  <span>Leaderboard</span>
                </div>
                <span className="text-muted">→</span>
              </Link>
              <Link
                href="/watch"
                className="flex items-center justify-between px-5 py-4 text-sm text-primary hover:bg-[rgba(200,241,53,0.04)] transition-colors"
              >
                <span>Watch</span>
                <span className="text-muted">→</span>
              </Link>
              <Link
                href="/earnings"
                className="flex items-center justify-between px-5 py-4 text-sm text-primary hover:bg-[rgba(200,241,53,0.04)] transition-colors"
              >
                <span>Earnings</span>
                <span className="text-muted">→</span>
              </Link>
              <Link
                href="/swap"
                className="flex items-center justify-between px-5 py-4 text-sm text-primary hover:bg-[rgba(200,241,53,0.04)] transition-colors"
              >
                <span>Swap Points</span>
                <span className="text-muted">→</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Not connected */
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-[rgba(200,241,53,0.12)] bg-[#0d0d0d] px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-2xl">
              👤
            </div>
            <div>
              <p className="font-semibold text-primary">Connect to Earn</p>
              <p className="mt-1 text-xs text-muted">Connect your wallet to start earning rewards</p>
            </div>
            <button
              onClick={connectMiniPay}
              disabled={isConnecting}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isConnecting ? '…' : 'Connect Wallet'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
