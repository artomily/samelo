'use client'

import type { UserAchievement } from '@/lib/types/achievement'
import { getProgressPct } from '@/lib/types/achievement'

interface Props {
  achievement: UserAchievement & { definition: NonNullable<UserAchievement['definition']> }
}

export function AchievementBadge({ achievement }: Props) {
  const unlocked = achievement.unlocked_at !== null
  const pct = getProgressPct(achievement.progress, achievement.definition.threshold)

  return (
    <div
      className={[
        'rounded-xl border p-3 space-y-2 transition-all',
        unlocked ? 'border-[#c8f135]/40 bg-[#c8f135]/5' : 'border-white/10 bg-white/5 opacity-60',
      ].join(' ')}
      title={achievement.definition.description}
    >
      <div className="flex items-start gap-2">
        <span className="text-2xl">{achievement.definition.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate">{achievement.definition.name}</p>
          <p className="text-xs text-white/40 truncate">{achievement.definition.description}</p>
        </div>
      </div>

      {!unlocked && (
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: '#c8f135' }}
          />
        </div>
      )}

      {achievement.definition.points_reward > 0 && unlocked && (
        <p className="text-xs" style={{ color: '#c8f135' }}>+{achievement.definition.points_reward} pts</p>
      )}
    </div>
  )
}
