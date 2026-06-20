'use client'

import { CATEGORY_COLORS, CATEGORY_LABELS, getClaimableAmount } from '@/lib/types/vesting'
import type { VestingSchedule } from '@/lib/types/vesting'
import { VestingProgress } from './VestingProgress'
import { ClaimButton } from './ClaimButton'

interface Props {
  schedule: VestingSchedule
  wallet: string
  onClaimed?: () => void
}

export function VestingScheduleCard({ schedule, wallet, onClaimed }: Props) {
  const claimable = getClaimableAmount(schedule)
  const color = CATEGORY_COLORS[schedule.category]
  const label = CATEGORY_LABELS[schedule.category]

  const vestEnd = new Date(schedule.vest_end)
  const isFullyVested = new Date() >= vestEnd

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: color + '22', color }}
        >
          {label}
        </span>
        <span className="text-xs text-white/40">
          {isFullyVested ? 'Fully vested' : `Until ${vestEnd.toLocaleDateString()}`}
        </span>
      </div>

      <VestingProgress schedule={schedule} />

      {claimable > 0 && (
        <ClaimButton
          scheduleId={schedule.id}
          wallet={wallet}
          claimable={claimable}
          onSuccess={onClaimed}
        />
      )}
    </div>
  )
}
