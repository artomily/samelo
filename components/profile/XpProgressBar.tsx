'use client'

import { xpToLevel, xpToNextLevel, LEVEL_NAMES } from '@/lib/xp'
import type { ProfileLevel } from '@/lib/xp'

interface XpProgressBarProps {
  xp: number
}

const LEVEL_COLORS: Record<ProfileLevel, string> = {
  1: '#ffffff40',
  2: '#35d07f',
  3: '#fbcc5c',
  4: '#f97316',
  5: '#c8f135',
}

export function XpProgressBar({ xp }: XpProgressBarProps) {
  const level = xpToLevel(xp)
  const { next, progress } = xpToNextLevel(xp)
  const color = LEVEL_COLORS[level]
  const isMax = level === 5

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold" style={{ color }}>
          Lv.{level} · {LEVEL_NAMES[level]}
        </span>
        <span className="text-white/40">
          {isMax ? 'MAX' : `${xp} / ${next} XP`}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.round(progress * 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
