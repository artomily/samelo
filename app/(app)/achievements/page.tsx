'use client'

import { useAccount } from 'wagmi'
import { useAchievementsSummary } from '@/hooks/useAchievementsV2'
import { AchievementsGrid } from '@/components/achievements/AchievementsGrid'

function AchievementsSummaryBar() {
  const { address } = useAccount()
  const { total, isLoading } = useAchievementsSummary(address)

  if (!address || isLoading) return null

  return (
    <div className="flex items-center gap-2 text-sm">
      <span style={{ color: '#c8f135' }} className="font-bold">{total}</span>
      <span className="text-white/40">achievements unlocked</span>
    </div>
  )
}

export default function AchievementsPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-1">
        <h1
          className="text-2xl font-bold tracking-wider uppercase"
          style={{ fontFamily: 'Orbitron, sans-serif', color: '#c8f135' }}
        >
          Achievements
        </h1>
        <AchievementsSummaryBar />
      </div>

      <AchievementsGrid />
    </main>
  )
}
