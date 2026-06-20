'use client'

import { useCreatorStats } from '@/hooks/useCreatorStats'
import { formatWatchTime, calcEngagementRate } from '@/lib/types/creator'

interface Props {
  wallet: string
}

export function CreatorStatsSummary({ wallet }: Props) {
  const { data, isLoading } = useCreatorStats(wallet)

  if (isLoading) return <p className="text-sm text-white/40">Loading stats…</p>
  if (!data) return null

  const { totals } = data.stats
  const engagement = calcEngagementRate(totals.views, totals.watchTimeSeconds)

  const items = [
    { label: 'Total Views', value: totals.views.toLocaleString() },
    { label: 'Watch Time', value: formatWatchTime(totals.watchTimeSeconds) },
    { label: 'Points Given', value: totals.pointsDistributed.toLocaleString() },
    { label: 'Engagement', value: `${engagement}%` },
    { label: 'New Followers', value: `+${totals.followerGrowth}` },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map(({ label, value }) => (
        <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-xl font-bold" style={{ color: '#c8f135' }}>{value}</p>
          <p className="text-xs text-white/40 mt-1">{label}</p>
        </div>
      ))}
    </div>
  )
}
