'use client'

import { useState } from 'react'
import { useReferralCode } from '@/hooks/useReferralCode'
import { buildReferralLink } from '@/lib/referral'

interface Props {
  wallet: string
}

export function ReferralCodeCard({ wallet }: Props) {
  const { data, isLoading } = useReferralCode(wallet)
  const [copied, setCopied] = useState(false)

  const code = data?.code?.code
  const link = code ? buildReferralLink(code) : ''

  async function copyLink() {
    if (!link) return
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return <div className="h-20 rounded-xl bg-white/5 animate-pulse" />
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
      <p className="text-xs text-white/50 uppercase tracking-widest">Your referral code</p>
      <p
        className="text-2xl font-bold tracking-widest"
        style={{ fontFamily: 'Orbitron, sans-serif', color: '#c8f135' }}
      >
        {code ?? '—'}
      </p>
      <button
        onClick={copyLink}
        disabled={!code}
        className="text-xs px-3 py-1.5 rounded border border-white/20 hover:border-white/40 transition-colors disabled:opacity-40"
      >
        {copied ? 'Copied!' : 'Copy invite link'}
      </button>
    </div>
  )
}
