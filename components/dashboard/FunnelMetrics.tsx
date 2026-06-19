'use client'

import { useTreasuryMetrics } from '@/hooks/useTreasuryMetrics'
import { Skeleton } from '@/components/Skeleton'

function MetricCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4 flex flex-col gap-1">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">{label}</p>
      <p
        className={`font-mono text-2xl font-black tabular-nums ${accent ? 'text-[#c8f135]' : 'text-white'}`}
        style={accent ? { textShadow: '0 0 12px rgba(200,241,53,0.4)' } : undefined}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {sub && <p className="text-[11px] text-white/30">{sub}</p>}
    </div>
  )
}

export function FunnelMetrics() {
  const { data, isLoading } = useTreasuryMetrics()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!data) return null

  const burnRate = data.totalPointsDistributed > 0
    ? ((data.totalPointsBurned / data.totalPointsDistributed) * 100).toFixed(1)
    : '0.0'

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <MetricCard
        label="Total Watches"
        value={data.totalWatches}
        sub="Web2 → on-chain events"
      />
      <MetricCard
        label="Points Issued"
        value={data.totalPointsDistributed.toLocaleString()}
        sub={`${data.totalWallets} wallets`}
      />
      <MetricCard
        label="Points Burned"
        value={data.totalPointsBurned.toLocaleString()}
        sub={`${burnRate}% redemption rate`}
        accent
      />
      <MetricCard
        label="$MELO Minted"
        value={data.totalMeloMinted}
        sub={`${data.swapCount} swaps`}
        accent
      />
    </div>
  )
}
