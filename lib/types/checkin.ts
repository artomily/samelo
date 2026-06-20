export interface DailyCheckin {
  id: string
  wallet: string
  checkin_date: string
  streak_day: number
  points_awarded: number
  created_at: string
}

export const BASE_CHECKIN_POINTS = 10
export const STREAK_BONUS_PER_DAY = 5
export const MAX_CHECKIN_STREAK_BONUS = 100

export function calcCheckinPoints(streakDay: number): number {
  const bonus = Math.min(streakDay * STREAK_BONUS_PER_DAY, MAX_CHECKIN_STREAK_BONUS)
  return BASE_CHECKIN_POINTS + bonus
}

export function getStreakMessage(streakDay: number): string {
  if (streakDay >= 30) return '🔥 Legendary streak!'
  if (streakDay >= 14) return '💎 Incredible streak!'
  if (streakDay >= 7) return '⚡ On fire!'
  if (streakDay >= 3) return '🌟 Building momentum!'
  return '✅ Keep going!'
}
