'use client'

import { useTreasuryMetrics } from '@/hooks/useTreasuryMetrics'
import { Skeleton } from '@/components/Skeleton'

function StatRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm text-white/70">{label}</p>
        {sub && <p className="text-[10px] text-white/30">{sub}</p>}
      </div>
      <span className="font-mono text-sm font-bold text-white">{value}</span>
    </div>
  )
}

export function ProtocolStats() {
  const { data, isLoading } = useTreasuryMetrics()

  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-lg" />
        ))}
      </div>
    )
  }

  if (!data) return null

  const avgPointsPerWatch = data.totalWatches > 0
    ? Math.round(data.totalPointsDistributed / data.totalWatches)
    : 0
  const avgMeloPerSwap = data.swapCount > 0
    ? (parseFloat(data.totalMeloMinted) / data.swapCount).toFixed(3)
    : '0.000'

  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-4">
      <h3 className="text-sm font-semibold text-white mb-3">Protocol Stats</h3>
      <StatRow
        label="Active Wallets"
        value={data.totalWallets.toLocaleString()}
        sub="unique wallet addresses"
      />
      <StatRow
        label="Avg Points / Watch"
        value={`${avgPointsPerWatch} pts`}
        sub="Web2 engagement reward"
      />
      <StatRow
        label="Total Swaps"
        value={data.swapCount.toLocaleString()}
        sub="Web3 redemptions"
      />
      <StatRow
        label="Avg $MELO / Swap"
        value={`${avgMeloPerSwap} $MELO`}
        sub="per on-chain transaction"
      />
      <StatRow
        label="Unclaimed Points"
        value={data.unclaimedPoints.toLocaleString()}
        sub="waiting to be swapped"
      />
    </div>
  )
}
