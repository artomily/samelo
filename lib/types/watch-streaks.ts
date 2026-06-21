export interface WatchStreak {
  id: string
  wallet: string
  current_streak: number
  longest_streak: number
  last_watch_date: string | null
  streak_started_at: string | null
  total_watch_days: number
  updated_at: string
}

export interface WatchStreakCheckpoint {
  id: string
  wallet: string
  watch_date: string
  minutes_watched: number
  streak_day: number
  created_at: string
}

export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100] as const
export type StreakMilestone = (typeof STREAK_MILESTONES)[number]

export const MILESTONE_BONUS_MELO: Record<StreakMilestone, number> = {
  3: 5,
  7: 15,
  14: 35,
  30: 80,
  60: 175,
  100: 300,
}

export function isStreakActive(streak: WatchStreak): boolean {
  if (!streak.last_watch_date) return false
  const last = new Date(streak.last_watch_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  last.setHours(0, 0, 0, 0)
  const diffDays = Math.floor((today.getTime() - last.getTime()) / 86_400_000)
  return diffDays <= 1
}

export function nextMilestone(streak: WatchStreak): StreakMilestone | null {
  for (const m of STREAK_MILESTONES) {
    if (streak.current_streak < m) return m
  }
  return null
}

export function daysToNextMilestone(streak: WatchStreak): number | null {
  const next = nextMilestone(streak)
  if (next === null) return null
  return next - streak.current_streak
}
