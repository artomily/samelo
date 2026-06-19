'use client'

import { useSwapperLeaderboard } from '@/hooks/useSwapperLeaderboard'
import { Skeleton } from '@/components/Skeleton'

const RANK_COLORS = ['#c8f135', '#35d07f', '#fbcc5c']

export function SwapperLeaderboard() {
  const { data: leaders, isLoading } = useSwapperLeaderboard()

  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-white">Top $MELO Earners</h3>
        <p className="text-[10px] text-white/40">Most points swapped on-chain</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>
      ) : !leaders?.length ? (
        <p className="text-center text-sm text-white/30 py-4">No swaps yet</p>
      ) : (
        <div className="space-y-1.5">
          {leaders.map((leader) => (
            <div
              key={leader.walletFull}
              className="flex items-center gap-3 rounded-lg bg-white/3 px-3 py-2"
            >
              <span
                className="shrink-0 font-mono text-xs font-black w-5 text-center"
                style={{ color: RANK_COLORS[leader.rank - 1] ?? 'rgba(255,255,255,0.3)' }}
              >
                #{leader.rank}
              </span>
              <span className="flex-1 font-mono text-xs text-white/60">{leader.wallet}</span>
              <div className="text-right">
                <p className="font-mono text-xs font-bold text-[#c8f135]">{leader.totalMelo} $MELO</p>
                <p className="text-[9px] text-white/30">{leader.swapCount} swaps</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
