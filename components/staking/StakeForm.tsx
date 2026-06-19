'use client'

import { useState } from 'react'
import { STAKING_TIERS } from '@/lib/types/staking'
import { StakingTierCard } from './StakingTierCard'
import { useCreateStake } from '@/hooks/useStaking'

export function StakeForm() {
  const [amount, setAmount] = useState('')
  const [lockDays, setLockDays] = useState(30)
  const createStake = useCreateStake()

  const selectedTier = STAKING_TIERS.find(t => t.lockDays === lockDays)!

  const handleStake = () => {
    if (!amount || parseFloat(amount) <= 0) return
    createStake.mutate({ amountMelo: amount, lockDays })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-white/50 mb-2 block">Amount to Stake ($MELO)</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0.000"
          min="0"
          step="0.001"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder:text-white/30 focus:outline-none focus:border-[#c8f135]/50"
        />
      </div>

      <div>
        <label className="text-xs text-white/50 mb-2 block">Lock Period</label>
        <div className="grid grid-cols-2 gap-2">
          {STAKING_TIERS.map(tier => (
            <StakingTierCard
              key={tier.lockDays}
              tier={tier}
              selected={lockDays === tier.lockDays}
              onSelect={() => setLockDays(tier.lockDays)}
            />
          ))}
        </div>
      </div>

      {amount && (
        <div className="rounded-lg bg-white/5 border border-white/10 p-3 text-xs space-y-1">
          <div className="flex justify-between text-white/50">
            <span>Staking</span><span className="text-white font-mono">{amount} MELO</span>
          </div>
          <div className="flex justify-between text-white/50">
            <span>Lock period</span><span className="text-white">{selectedTier.label}</span>
          </div>
          <div className="flex justify-between text-white/50">
            <span>Point bonus</span><span className="text-[#c8f135] font-semibold">+{selectedTier.bonusPercent}% on all watches</span>
          </div>
        </div>
      )}

      <button
        onClick={handleStake}
        disabled={!amount || parseFloat(amount) <= 0 || createStake.isPending}
        className="w-full py-2.5 rounded-lg bg-[#c8f135] text-black text-sm font-semibold hover:bg-[#d4f557] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {createStake.isPending ? 'Staking…' : `Stake $MELO · +${selectedTier.bonusPercent}% Bonus`}
      </button>
      {createStake.isSuccess && <p className="text-[#35d07f] text-xs text-center">Staked successfully!</p>}
      {createStake.isError && <p className="text-red-400 text-xs text-center">Failed to stake. Try again.</p>}
    </div>
  )
}
