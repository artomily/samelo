export const XP_THRESHOLDS = [0, 50, 200, 500, 1000] as const

export type ProfileLevel = 1 | 2 | 3 | 4 | 5
export const LEVEL_NAMES: Record<ProfileLevel, string> = {
  1: 'Observer',
  2: 'Watcher',
  3: 'Miner',
  4: 'Pioneer',
  5: 'Legend',
}

export function xpToLevel(xp: number): ProfileLevel {
  if (xp >= XP_THRESHOLDS[4]) return 5
  if (xp >= XP_THRESHOLDS[3]) return 4
  if (xp >= XP_THRESHOLDS[2]) return 3
  if (xp >= XP_THRESHOLDS[1]) return 2
  return 1
}

export function xpToNextLevel(xp: number): { current: number; next: number; progress: number } {
  const level = xpToLevel(xp)
  if (level === 5) return { current: xp, next: XP_THRESHOLDS[4], progress: 1 }
  const current = XP_THRESHOLDS[level - 1]
  const next = XP_THRESHOLDS[level]
  return { current, next, progress: (xp - current) / (next - current) }
}

export function calcXp(stats: { watchCount: number; quizCount: number; referralCount: number }): number {
  return stats.watchCount * 1 + stats.quizCount * 3 + stats.referralCount * 10
}

export function updateStreak(lastWatchDate: string | null, today: string): {
  currentStreak: number
  isNewDay: boolean
} {
  if (!lastWatchDate) return { currentStreak: 1, isNewDay: true }
  if (lastWatchDate === today) return { currentStreak: 0, isNewDay: false }
  const last = new Date(lastWatchDate)
  const todayDate = new Date(today)
  const diffDays = Math.floor((todayDate.getTime() - last.getTime()) / 86_400_000)
  return { currentStreak: diffDays === 1 ? 1 : 0, isNewDay: true }
}
