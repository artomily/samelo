'use client'

import { getTierConfigV2, isPositionUnlocked, getPositionDaysRemaining } from '@/lib/types/staking-v2'
import type { StakingPosition } from '@/lib/types/staking-v2'
import { useUnstake } from '@/hooks/useStakingV2'

interface Props {
  position: StakingPosition
  wallet: string
}

const TIER_COLORS = ['#cd7f32', '#c0c0c0', '#ffd700', '#b9f2ff']

export function StakingPositionCard({ position, wallet }: Props) {
  const config = getTierConfigV2(position.tier)
  const unlocked = isPositionUnlocked(position)
  const daysLeft = getPositionDaysRemaining(position)
  const color = TIER_COLORS[position.tier - 1]!
  const { mutate, isPending } = useUnstake(wallet)

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold" style={{ color }}>{config.label}</span>
        <span className="text-xs text-white/40">
          {unlocked ? 'Unlocked' : `${daysLeft}d remaining`}
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-white/60">Staked</span>
        <span className="font-semibold" style={{ color: '#c8f135' }}>
          {position.amount_melo.toFixed(2)} MELO
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-white/60">Multiplier</span>
        <span>{position.bonus_multiplier}×</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-white/60">Points earned</span>
        <span style={{ color: '#c8f135' }}>{position.reward_points.toLocaleString()}</span>
      </div>

      {unlocked && (
        <button
          onClick={() => mutate({ positionId: position.id })}
          disabled={isPending}
          className="w-full py-2 rounded text-sm font-medium transition-opacity disabled:opacity-40"
          style={{ background: '#c8f135', color: '#030303' }}
        >
          {isPending ? 'Unstaking…' : 'Unstake'}
        </button>
      )}
    </div>
  )
}
