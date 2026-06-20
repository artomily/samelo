'use client'

import { useAccount } from 'wagmi'
import { PersonalStatsGrid } from '@/components/analytics/PersonalStatsGrid'
import { ActivityChart } from '@/components/analytics/ActivityChart'

export default function AnalyticsPage() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/40">Connect wallet to view your analytics.</p>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-['Orbitron']">My Analytics</h1>
        <p className="text-white/40 text-sm mt-1">Your personal watch-to-earn stats</p>
      </div>

      <PersonalStatsGrid />

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <ActivityChart />
      </div>
    </main>
  )
}
