'use client'

import { getLevelForXp, getXpToNextLevel, getLevelProgressPct, LEVELS } from '@/lib/types/xp'

interface Props {
  xp: number
}

export function XpProgressBar({ xp }: Props) {
  const level = getLevelForXp(xp)
  const pct = getLevelProgressPct(xp)
  const toNext = getXpToNextLevel(xp)
  const isMaxLevel = level.level === LEVELS[LEVELS.length - 1]!.level

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-semibold" style={{ color: level.color }}>
          Lv.{level.level} {level.title}
        </span>
        {!isMaxLevel && (
          <span className="text-white/40">{toNext} XP to next level</span>
        )}
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: level.color }}
        />
      </div>
      <p className="text-xs text-white/30">{xp.toLocaleString()} total XP</p>
    </div>
  )
}
