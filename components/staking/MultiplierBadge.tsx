'use client'

import { useStakeMultiplier } from '@/hooks/useStaking'

export function MultiplierBadge() {
  const { data } = useStakeMultiplier()
  const multiplier = data?.multiplier ?? 1.0
  const isStaking = multiplier > 1.0

  if (!isStaking) return null

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#c8f135]/10 border border-[#c8f135]/30">
      <span className="text-xs">⚡</span>
      <span className="text-xs font-semibold text-[#c8f135]">
        ×{multiplier.toFixed(2)} Point Bonus Active
      </span>
    </div>
  )
}
