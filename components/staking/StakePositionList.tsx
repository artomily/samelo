'use client'

import { useStakePositions } from '@/hooks/useStaking'
import { daysRemaining, isUnlocked } from '@/lib/types/staking'

export function StakePositionList() {
  const { data, isLoading } = useStakePositions()
  const positions = data?.positions ?? []

  if (isLoading) return <div className="text-white/40 text-sm">Loading positions…</div>
  if (positions.length === 0) return <p className="text-white/30 text-sm text-center py-6">No active stakes yet</p>

  return (
    <div className="space-y-2">
      {positions.map(pos => {
        const unlocked = isUnlocked(pos.unlockAt)
        const days = daysRemaining(pos.unlockAt)
        return (
          <div key={pos.id} className={`rounded-xl border p-4 ${pos.isActive ? 'border-white/10 bg-white/5' : 'border-white/5 opacity-50'}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white font-mono font-semibold">{parseFloat(pos.amountMelo).toFixed(3)} MELO</p>
                <p className="text-xs text-white/40 mt-0.5">{pos.lockDays}d lock · ×{parseFloat(pos.bonusMultiplier.toString()).toFixed(2)} bonus</p>
              </div>
              <div className="text-right">
                {unlocked ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#35d07f]/20 text-[#35d07f]">Unlocked</span>
                ) : (
                  <span className="text-xs text-white/40">{days}d left</span>
                )}
              </div>
            </div>
            <div className="mt-2 h-1 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#c8f135]"
                style={{ width: unlocked ? '100%' : `${((pos.lockDays - days) / pos.lockDays) * 100}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
