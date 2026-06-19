'use client'

import { useRecentSwaps } from '@/hooks/useRecentSwaps'
import { Skeleton } from '@/components/Skeleton'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function LiveSwapFeed() {
  const { data: swaps, isLoading } = useRecentSwaps()

  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#c8f135] animate-pulse" />
        <h3 className="text-sm font-semibold text-white">Live On-Chain Swaps</h3>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>
      ) : !swaps?.length ? (
        <p className="text-center text-sm text-white/30 py-6">No swaps yet</p>
      ) : (
        <div className="space-y-2">
          {swaps.map((swap, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-white/3 px-3 py-2 gap-3"
            >
              <div className="min-w-0">
                <p className="font-mono text-xs text-white/60 truncate">{swap.wallet}</p>
                <p className="text-[10px] text-white/30">{timeAgo(swap.createdAt)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-white/40">−{swap.pointsBurned.toLocaleString()} pts</p>
                <p className="font-mono text-sm font-bold text-[#c8f135]">
                  +{swap.meloReceived} $MELO
                </p>
              </div>
              {swap.txHash && (
                <a
                  href={`https://celoscan.io/tx/${swap.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-[10px] text-white/20 hover:text-accent transition-colors"
                  title="View on Celoscan"
                >
                  ↗
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
