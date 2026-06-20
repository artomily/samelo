'use client'

import { usePersonalAnalytics } from '@/hooks/usePersonalAnalytics'
import { PersonalStatCard } from './PersonalStatCard'
import { formatCompact } from '@/lib/format-number'
import { LEVEL_NAMES, xpToLevel } from '@/lib/xp'
import type { ProfileLevel } from '@/lib/xp'

export function PersonalStatsGrid() {
  const { data, isLoading } = usePersonalAnalytics()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!data) return null

  const level = xpToLevel(data.xp) as ProfileLevel

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <PersonalStatCard label="Videos Watched" value={formatCompact(data.totalWatches)} icon="▶️" highlight />
      <PersonalStatCard label="Quizzes Done" value={data.totalQuizzes} icon="📝" />
      <PersonalStatCard label="Referrals" value={data.totalReferrals} icon="🤝" />
      <PersonalStatCard label="Current Streak" value={`${data.currentStreak}d`} icon="🔥" />
      <PersonalStatCard label="Points Earned" value={formatCompact(data.totalPointsEarned)} icon="🪙" highlight />
      <PersonalStatCard label="MELO Earned" value={data.totalMeloEarned.toFixed(3)} icon="⚡" />
      <PersonalStatCard label="Avg Points/Day" value={data.avgPointsPerDay} icon="📈" sub={`over ${data.daysSinceJoined} days`} />
      <PersonalStatCard label="Level" value={`${level} · ${LEVEL_NAMES[level]}`} icon="🏆" sub={`${formatCompact(data.xp)} XP`} />
    </div>
  )
}
