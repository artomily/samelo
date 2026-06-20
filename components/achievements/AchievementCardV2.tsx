'use client'

import { RARITY_COLORS_V2, CATEGORY_ICONS, progressPct } from '@/lib/types/achievements-v2'
import type { AchievementWithProgress } from '@/lib/types/achievements-v2'

interface Props {
  achievement: AchievementWithProgress
}

export function AchievementCardV2({ achievement }: Props) {
  const rarityColor = RARITY_COLORS_V2[achievement.rarity]
  const icon = CATEGORY_ICONS[achievement.category]
  const unlocked = achievement.progress?.unlocked ?? false
  const pct = progressPct(achievement)

  return (
    <div
      className={`bg-[#0d0d0d] border rounded-lg p-4 space-y-2 ${
        unlocked ? '' : 'opacity-60'
      }`}
      style={{ borderColor: unlocked ? rarityColor : '#1a1a1a' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{ color: rarityColor, border: `1px solid ${rarityColor}` }}
        >
          {achievement.rarity}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white font-[Orbitron]">{achievement.title}</h3>
        <p className="text-xs text-[#666] mt-0.5">{achievement.description}</p>
      </div>
      {!unlocked && achievement.progress && (
        <div className="space-y-1">
          <div className="h-1 bg-[#1a1a1a] rounded overflow-hidden">
            <div className="h-1 rounded transition-all" style={{ width: `${pct}%`, backgroundColor: rarityColor }} />
          </div>
          <p className="text-[10px] text-[#555]">
            {achievement.progress.current_value} / {achievement.condition_threshold}
          </p>
        </div>
      )}
      {unlocked && (
        <p className="text-[10px]" style={{ color: rarityColor }}>
          ✓ Unlocked · +{achievement.points_reward} pts
        </p>
      )}
    </div>
  )
}
