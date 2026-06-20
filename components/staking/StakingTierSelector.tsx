'use client'

import { STAKING_TIER_CONFIGS } from '@/lib/types/staking-v2'
import type { StakingTierV2 } from '@/lib/types/staking-v2'

interface Props {
  selected: StakingTierV2 | null
  onChange: (tier: StakingTierV2) => void
}

const TIER_COLORS = ['#cd7f32', '#c0c0c0', '#ffd700', '#b9f2ff']

export function StakingTierSelector({ selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {STAKING_TIER_CONFIGS.map((config) => {
        const color = TIER_COLORS[config.tier - 1]!
        const isSelected = selected === config.tier
        return (
          <button
            key={config.tier}
            onClick={() => onChange(config.tier)}
            className={[
              'rounded-xl border p-3 text-left transition-all space-y-1',
              isSelected ? 'border-[#c8f135]/60 bg-[#c8f135]/5' : 'border-white/10 bg-white/5 hover:bg-white/10',
            ].join(' ')}
          >
            <p className="text-xs font-bold" style={{ color }}>{config.label}</p>
            <p className="text-xs text-white/50">{config.bonusMultiplier}× multiplier</p>
            <p className="text-xs text-white/40">Min {config.minMelo} MELO</p>
          </button>
        )
      })}
    </div>
  )
}
