export type AchievementCategory = 'watch' | 'social' | 'quiz' | 'staking' | 'governance' | 'streak' | 'referral' | 'special'
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export interface AchievementDefinitionV2 {
  id: string
  slug: string
  title: string
  description: string
  category: AchievementCategory
  rarity: AchievementRarity
  icon_url: string | null
  points_reward: number
  condition_type: string
  condition_threshold: number
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface AchievementProgressV2 {
  id: string
  wallet: string
  achievement_id: string
  current_value: number
  unlocked: boolean
  unlocked_at: string | null
  points_awarded: boolean
  created_at: string
  updated_at: string
}

export interface AchievementWithProgress extends AchievementDefinitionV2 {
  progress: AchievementProgressV2 | null
}

export const RARITY_COLORS_V2: Record<AchievementRarity, string> = {
  common: '#888',
  uncommon: '#4ade80',
  rare: '#60a5fa',
  epic: '#c084fc',
  legendary: '#c8f135',
}

export const CATEGORY_ICONS: Record<AchievementCategory, string> = {
  watch: '▶',
  social: '👥',
  quiz: '✓',
  staking: '⚡',
  governance: '🗳',
  streak: '🔥',
  referral: '🔗',
  special: '⭐',
}

export function progressPct(achievement: AchievementWithProgress): number {
  if (!achievement.progress) return 0
  return Math.min(100, Math.round((achievement.progress.current_value / achievement.condition_threshold) * 100))
}
