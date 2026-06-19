'use client'

import { useAccount } from 'wagmi'
import { useSwapHistory } from '@/hooks/useSwapHistory'
import { Skeleton } from './Skeleton'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export function SwapHistory() {
  const { address } = useAccount()
  const { data: swaps, isLoading } = useSwapHistory(address)

  if (!address) return null

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-lg" />
        ))}
      </div>
    )
  }

  if (!swaps?.length) {
    return <p className="text-center text-sm text-white/40 py-6">No swaps yet</p>
  }

  return (
    <div className="space-y-2">
      {swaps.map((swap) => (
        <div
          key={swap.id}
          className="flex items-center justify-between rounded-lg border border-white/5 bg-white/3 px-4 py-3"
        >
          <div>
            <p className="text-sm text-white font-medium">−{swap.pointsBurned} pts</p>
            <p className="text-xs text-white/40">{formatDate(swap.createdAt)}</p>
          </div>
          <span className="font-mono text-sm font-bold text-[#c8f135]">
            +{swap.meloReceived} $MELO
          </span>
        </div>
      ))}
    </div>
  )
}
