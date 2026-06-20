'use client'

import { useState } from 'react'
import { useCreateStake } from '@/hooks/useStakingV2'
import { StakingTierSelector } from './StakingTierSelector'
import { getTierConfigV2 } from '@/lib/types/staking-v2'
import type { StakingTierV2 } from '@/lib/types/staking-v2'

interface Props {
  wallet: string
}

export function StakeFormV2({ wallet }: Props) {
  const [tier, setTier] = useState<StakingTierV2 | null>(null)
  const [amount, setAmount] = useState('')
  const { mutate, isPending, isSuccess, error } = useCreateStake(wallet)

  const config = tier ? getTierConfigV2(tier) : null
  const amountNum = parseFloat(amount) || 0
  const valid = tier !== null && amountNum >= (config?.minMelo ?? 0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || !tier) return
    mutate({ amountMelo: amountNum, tier })
  }

  if (isSuccess) {
    return (
      <div className="rounded-xl border border-[#c8f135]/30 bg-[#c8f135]/5 p-4">
        <p className="text-sm font-medium" style={{ color: '#c8f135' }}>Staked successfully!</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StakingTierSelector selected={tier} onChange={setTier} />

      <div className="space-y-1">
        <label className="text-xs text-white/50">Amount (MELO)</label>
        <input
          type="number"
          min={config?.minMelo ?? 0}
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={config ? `Min ${config.minMelo}` : 'Select tier first'}
          disabled={!tier}
          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30 disabled:opacity-40"
        />
      </div>

      {config && amountNum > 0 && (
        <p className="text-xs text-white/40">
          Daily rewards: ~{(amountNum * config.bonusMultiplier).toFixed(0)} pts/day
        </p>
      )}

      <button
        type="submit"
        disabled={!valid || isPending}
        className="w-full py-2 rounded text-sm font-medium transition-opacity disabled:opacity-40"
        style={{ background: '#c8f135', color: '#030303' }}
      >
        {isPending ? 'Staking…' : 'Stake MELO'}
      </button>

      {error && <p className="text-xs text-red-400">{error.message}</p>}
    </form>
  )
}
