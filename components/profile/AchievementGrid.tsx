'use client'

import { getAchievements, countUnlocked, type AchievementInput } from '@/lib/achievements'
import { AchievementBadge } from './AchievementBadge'

interface AchievementGridProps {
  stats: AchievementInput
}

export function AchievementGrid({ stats }: AchievementGridProps) {
  const achievements = getAchievements(stats)
  const unlocked = countUnlocked(achievements)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/70">Achievements</h3>
        <span className="text-xs text-white/40">{unlocked}/{achievements.length} unlocked</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {achievements.map(a => (
          <AchievementBadge key={a.id} achievement={a} />
        ))}
      </div>
    </div>
  )
}
