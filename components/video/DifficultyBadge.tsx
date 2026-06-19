'use client'

import type { VideoDifficulty } from '@/lib/types/video'
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/lib/types/video'

interface DifficultyBadgeProps {
  difficulty: VideoDifficulty
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const color = DIFFICULTY_COLORS[difficulty]
  return (
    <span
      className="text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide"
      style={{ color, backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
    >
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  )
}
