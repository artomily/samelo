'use client'

import { useState } from 'react'
import { useMyReferral } from '@/hooks/useReferrals'
import { buildReferralUrl } from '@/lib/types/referrals'

interface Props {
  wallet: string
}

export function ReferralCard({ wallet }: Props) {
  const { data, isLoading } = useMyReferral(wallet)
  const [copied, setCopied] = useState(false)

  if (isLoading) return <div className="text-sm text-[#666] animate-pulse">Loading…</div>
  if (!data) return null

  const { referral, conversions } = data
  const url = buildReferralUrl(referral.code, typeof window !== 'undefined' ? window.location.origin : '')

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[#222] bg-[#0d0d0d] p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#888]">Your referral code</span>
        <span className="text-lg font-mono font-bold text-[#c8f135]">{referral.code}</span>
      </div>

      <div className="flex items-center gap-2 rounded bg-[#111] px-3 py-2 text-xs text-[#666] font-mono break-all">
        <span className="flex-1 truncate">{url}</span>
        <button
          onClick={handleCopy}
          className="shrink-0 text-[#c8f135] hover:opacity-70 transition-opacity"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="flex gap-6 text-sm">
        <div className="flex flex-col">
          <span className="text-[#888] text-xs">Referrals</span>
          <span className="text-white font-semibold">{referral.total_uses}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[#888] text-xs">Bonuses paid</span>
          <span className="text-[#c8f135] font-semibold">
            {conversions.filter((c) => c.bonus_paid).length}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[#888] text-xs">Bonus per ref</span>
          <span className="text-white font-semibold">{referral.bonus_melo} MELO</span>
        </div>
      </div>
    </div>
  )
}
