'use client'

import { getLevelForXp } from '@/lib/types/xp'

interface Props {
  xp: number
  size?: 'sm' | 'md' | 'lg'
}

export function LevelBadge({ xp, size = 'md' }: Props) {
  const level = getLevelForXp(xp)

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  }[size]

  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center font-bold border-2`}
      style={{
        borderColor: level.color,
        background: level.color + '20',
        color: level.color,
      }}
      title={`Lv.${level.level} ${level.title}`}
    >
      {level.level}
    </div>
  )
}
