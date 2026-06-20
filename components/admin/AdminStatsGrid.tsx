'use client'

import { useAdminStats } from '@/hooks/useAdminStats'
import { AdminStatCard } from './AdminStatCard'
import { formatCompact } from '@/lib/format-number'

export function AdminStatsGrid() {
  const { data, isLoading } = useAdminStats()

  if (isLoading) return <div className="text-white/40 text-sm">Loading stats…</div>
  if (!data) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <AdminStatCard label="Total Users" value={formatCompact(data.totalUsers)} accent />
      <AdminStatCard label="Total Watches" value={formatCompact(data.totalWatches)} />
      <AdminStatCard label="Points Issued" value={formatCompact(data.totalPointsIssued)} />
      <AdminStatCard label="Points Burned" value={formatCompact(data.totalPointsBurned)} />
      <AdminStatCard label="MELO Minted" value={data.totalMeloMinted.toFixed(3)} accent />
      <AdminStatCard label="Total Swaps" value={data.totalSwaps} />
      <AdminStatCard label="New Users (7d)" value={data.newUsersLast7Days} sub="last 7 days" />
      <AdminStatCard label="Active Users (7d)" value={data.activeUsersLast7Days} sub="last 7 days" />
    </div>
  )
}
