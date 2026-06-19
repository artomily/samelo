'use client'

import type { StakingTier } from '@/lib/types/staking'

interface StakingTierCardProps {
  tier: StakingTier
  selected: boolean
  onSelect: () => void
}

export function StakingTierCard({ tier, selected, onSelect }: StakingTierCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-xl border text-left transition-all ${
        selected
          ? 'border-[#c8f135] bg-[#c8f135]/10'
          : 'border-white/10 bg-white/5 hover:border-white/30'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`font-semibold text-sm ${selected ? 'text-[#c8f135]' : 'text-white'}`}>
            {tier.label}
          </p>
          <p className="text-xs text-white/50 mt-0.5">{tier.lockDays} day lock</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold font-mono ${selected ? 'text-[#c8f135]' : 'text-white'}`}>
            +{tier.bonusPercent}%
          </p>
          <p className="text-[10px] text-white/40">point bonus</p>
        </div>
      </div>
      <div className="mt-2 h-1 rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#c8f135]"
          style={{ width: `${(tier.bonusPercent / 75) * 100}%` }}
        />
      </div>
    </button>
  )
}
