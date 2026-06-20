'use client'
import { useAdminMetrics } from '@/hooks/useAdminMetrics'
import { StatCard } from '@/components/ui/StatCard'
import { Skeleton } from '@/components/ui/Skeleton'

export function MetricsGrid() {
  const { data, isLoading } = useAdminMetrics()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    )
  }

  const m = data?.metrics
  if (!m) return null

  const completionRate = m.videoPlays > 0
    ? Math.round((m.videoCompletions / m.videoPlays) * 100)
    : 0

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard label="Page Views" value={m.pageViews.toLocaleString()} />
      <StatCard label="Unique Wallets" value={m.uniqueWallets.toLocaleString()} />
      <StatCard label="Video Plays" value={m.videoPlays.toLocaleString()} />
      <StatCard label="Completions" value={m.videoCompletions.toLocaleString()} />
      <StatCard label="Completion Rate" value={`${completionRate}%`} />
      <StatCard label="Swaps" value={m.swaps.toLocaleString()} />
    </div>
  )
}
