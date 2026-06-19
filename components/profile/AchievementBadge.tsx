'use client'

import type { Achievement } from '@/lib/achievements'

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'sm' | 'md'
}

export function AchievementBadge({ achievement, size = 'md' }: AchievementBadgeProps) {
  const isLg = size === 'md'
  return (
    <div
      title={`${achievement.title}: ${achievement.description}`}
      className={`relative flex flex-col items-center gap-1 ${isLg ? 'w-16' : 'w-10'}`}
    >
      <div className={`
        flex items-center justify-center rounded-full border-2
        ${achievement.unlocked
          ? 'border-[#c8f135] bg-[#c8f135]/10'
          : 'border-white/10 bg-white/5 grayscale opacity-40'}
        ${isLg ? 'w-12 h-12 text-2xl' : 'w-8 h-8 text-base'}
      `}>
        {achievement.icon}
      </div>
      {isLg && (
        <span className={`text-[10px] text-center leading-tight ${achievement.unlocked ? 'text-white/70' : 'text-white/30'}`}>
          {achievement.title}
        </span>
      )}
    </div>
  )
}
