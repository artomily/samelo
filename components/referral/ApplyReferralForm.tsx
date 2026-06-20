'use client'

import { useState } from 'react'
import { useApplyReferral } from '@/hooks/useReferralCode'

interface Props {
  wallet: string
}

export function ApplyReferralForm({ wallet }: Props) {
  const [code, setCode] = useState('')
  const { mutate, isPending, isSuccess, error, data } = useApplyReferral(wallet)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    mutate({ code: code.trim() })
  }

  if (isSuccess) {
    return (
      <div className="rounded-xl border border-[#c8f135]/30 bg-[#c8f135]/5 p-4">
        <p className="text-sm font-medium" style={{ color: '#c8f135' }}>
          Code applied! +{data?.bonusPoints} bonus points added.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <p className="text-xs text-white/50">Have a referral code?</p>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="SMLO-XXXXXX-XXX"
          maxLength={20}
          className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30"
        />
        <button
          type="submit"
          disabled={isPending || !code.trim()}
          className="px-4 py-2 rounded text-sm font-medium transition-opacity disabled:opacity-40"
          style={{ background: '#c8f135', color: '#030303' }}
        >
          {isPending ? 'Applying…' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error.message}</p>}
    </form>
  )
}
