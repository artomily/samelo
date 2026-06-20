export type AchievementCategory = 'watch' | 'quiz' | 'social' | 'stake' | 'swap' | 'general'

export interface AchievementDefinition {
  id: string
  name: string
  description: string
  icon: string
  category: AchievementCategory
  points_reward: number
  threshold: number
}

export interface UserAchievement {
  id: string
  wallet: string
  achievement_id: string
  progress: number
  unlocked_at: string | null
  created_at: string
  definition?: AchievementDefinition
}

export const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  watch: 'Watching',
  quiz: 'Quizzes',
  social: 'Social',
  stake: 'Staking',
  swap: 'Swapping',
  general: 'General',
}

export function getProgressPct(progress: number, threshold: number): number {
  return Math.min(100, Math.floor((progress / threshold) * 100))
}

export function isUnlocked(achievement: UserAchievement): boolean {
  return achievement.unlocked_at !== null
}
