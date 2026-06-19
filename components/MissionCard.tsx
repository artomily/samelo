'use client'

import type { MissionWithProgress } from '@/lib/types/missions'

interface Props {
  mission: MissionWithProgress
  onClaim?: (missionId: string) => void
  claiming?: boolean
}

export function MissionCard({ mission, onClaim, claiming }: Props) {
  const { title, description, rewardPoints, progress, targetValue, progressPercent, isCompleted, isClaimed } = mission

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-white text-sm">{title}</h3>
          <p className="text-xs text-white/50 mt-0.5">{description}</p>
        </div>
        <span className="shrink-0 text-xs font-mono text-[#c8f135] bg-[#c8f135]/10 px-2 py-1 rounded-md">
          +{rewardPoints} pts
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-white/40">
          <span>{progress} / {targetValue}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#c8f135] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {isCompleted && !isClaimed && onClaim && (
        <button
          onClick={() => onClaim(mission.id)}
          disabled={claiming}
          className="w-full rounded-lg bg-[#c8f135] text-black font-bold text-sm py-2 hover:bg-[#d4f855] disabled:opacity-50 transition-colors"
        >
          {claiming ? 'Claiming…' : 'Claim Reward'}
        </button>
      )}

      {isClaimed && (
        <div className="text-center text-xs text-[#c8f135] font-semibold">Claimed</div>
      )}
    </div>
  )
}
