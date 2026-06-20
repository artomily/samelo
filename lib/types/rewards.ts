export interface DailyReward {
  id: string
  wallet: string
  day: string
  points_earned: number
  videos_watched: number
  quizzes_passed: number
  bonus_multiplier: number
  created_at: string
}

export interface RewardTier {
  id: number
  name: string
  min_daily_points: number
  bonus_multiplier: number
  badge_emoji: string
}

export interface WeeklyReward {
  id: string
  wallet: string
  week_start: string
  total_points: number
  streak_days: number
  rank: number | null
  reward_claimed: boolean
  created_at: string
}

export const REWARD_TIERS: RewardTier[] = [
  { id: 1, name: 'Starter', min_daily_points: 0, bonus_multiplier: 1.0, badge_emoji: '⭐' },
  { id: 2, name: 'Active', min_daily_points: 100, bonus_multiplier: 1.1, badge_emoji: '🔥' },
  { id: 3, name: 'Super', min_daily_points: 300, bonus_multiplier: 1.25, badge_emoji: '💎' },
  { id: 4, name: 'Legend', min_daily_points: 600, bonus_multiplier: 1.5, badge_emoji: '🌟' },
]

export function getTierForPoints(dailyPoints: number): RewardTier {
  const tier = [...REWARD_TIERS].reverse().find(t => dailyPoints >= t.min_daily_points)
  return tier ?? REWARD_TIERS[0]
}

export const POINTS_PER_VIDEO = 10
export const POINTS_PER_QUIZ = 25
export const STREAK_BONUS_PER_DAY = 5
export const MAX_STREAK_BONUS = 50
