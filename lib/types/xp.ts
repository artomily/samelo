export type XpSource = 'watch' | 'quiz' | 'checkin' | 'referral' | 'stake' | 'achievement' | 'bonus'

export interface XpEvent {
  id: string
  wallet: string
  amount: number
  source: XpSource
  description: string | null
  created_at: string
}

export interface LevelConfig {
  level: number
  title: string
  xpRequired: number
  color: string
}

export const LEVELS: LevelConfig[] = [
  { level: 1, title: 'Observer',  xpRequired: 0,      color: '#6b7280' },
  { level: 2, title: 'Watcher',   xpRequired: 500,    color: '#3b82f6' },
  { level: 3, title: 'Miner',     xpRequired: 2000,   color: '#8b5cf6' },
  { level: 4, title: 'Pioneer',   xpRequired: 6000,   color: '#f59e0b' },
  { level: 5, title: 'Legend',    xpRequired: 15000,  color: '#c8f135' },
]

export const XP_PER_WATCH = 5
export const XP_PER_QUIZ = 20
export const XP_PER_CHECKIN = 10
export const XP_PER_REFERRAL = 50

export function getLevelForXp(xp: number): LevelConfig {
  let current = LEVELS[0]!
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) current = level
    else break
  }
  return current
}

export function getXpToNextLevel(xp: number): number {
  const current = getLevelForXp(xp)
  const nextLevel = LEVELS.find((l) => l.level === current.level + 1)
  if (!nextLevel) return 0
  return nextLevel.xpRequired - xp
}

export function getLevelProgressPct(xp: number): number {
  const current = getLevelForXp(xp)
  const next = LEVELS.find((l) => l.level === current.level + 1)
  if (!next) return 100
  const range = next.xpRequired - current.xpRequired
  const earned = xp - current.xpRequired
  return Math.min(100, Math.floor((earned / range) * 100))
}
