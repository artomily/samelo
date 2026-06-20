'use client'

import { computeVestedAmount } from '@/lib/types/vesting'
import type { VestingSchedule } from '@/lib/types/vesting'

interface Props {
  schedule: VestingSchedule
}

export function VestingProgress({ schedule }: Props) {
  const vested = computeVestedAmount(schedule)
  const pct = schedule.total_melo > 0 ? (vested / schedule.total_melo) * 100 : 0
  const claimedPct = schedule.total_melo > 0 ? (schedule.vested_melo / schedule.total_melo) * 100 : 0

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-white/50">
        <span>{vested.toFixed(2)} / {schedule.total_melo.toFixed(2)} MELO vested</span>
        <span>{pct.toFixed(1)}%</span>
      </div>
      <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-white/20 rounded-full"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${claimedPct}%`, background: '#c8f135' }}
        />
      </div>
      <div className="flex justify-between text-xs text-white/40">
        <span>Claimed: {schedule.vested_melo.toFixed(2)}</span>
        <span>Claimable: {Math.max(0, vested - schedule.vested_melo).toFixed(2)}</span>
      </div>
    </div>
  )
}
