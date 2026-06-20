'use client'

import { useCampaignAnalytics } from '@/hooks/useCampaignAnalytics'

interface Props {
  campaignId: string
  wallet: string
}

export function AnalyticsDashboard({ campaignId, wallet }: Props) {
  const { data, isLoading } = useCampaignAnalytics(campaignId, wallet)

  if (isLoading) {
    return <div className="grid grid-cols-2 gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />)}</div>
  }

  if (!data) return null

  const stats = [
    { label: 'Impressions', value: data.totalImpressions.toLocaleString() },
    { label: 'Spent', value: `$${(data.totalSpent / 100).toFixed(2)}` },
    { label: 'Remaining', value: `$${(data.remainingBudget / 100).toFixed(2)}` },
    { label: 'Fill Rate', value: `${Math.round(data.fillRate * 100)}%` },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ label, value }) => (
        <div key={label} className="p-3 rounded-xl border border-white/10 bg-white/5 text-center">
          <p className="text-[#c8f135] text-xl font-bold font-display">{value}</p>
          <p className="text-white/40 text-xs mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  )
}
