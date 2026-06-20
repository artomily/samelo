export type BadgeCategory = 'platform' | 'creator' | 'community' | 'special' | 'seasonal'
export type BadgeRarityV2 = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export interface BadgeType {
  id: string
  slug: string
  name: string
  description: string
  category: BadgeCategory
  rarity: BadgeRarityV2
  image_url: string | null
  animated_url: string | null
  background_color: string
  is_transferable: boolean
  max_supply: number | null
  total_issued: number
  is_active: boolean
  created_at: string
}

export interface UserBadgeAward {
  id: string
  wallet: string
  badge_type_id: string
  awarded_by: string | null
  award_reason: string | null
  token_id: string | null
  displayed: boolean
  awarded_at: string
}

export interface BadgeWithAward extends BadgeType {
  award: UserBadgeAward | null
}

export const BADGE_RARITY_COLORS: Record<BadgeRarityV2, string> = {
  common: '#666',
  uncommon: '#4ade80',
  rare: '#60a5fa',
  epic: '#c084fc',
  legendary: '#c8f135',
}

export function isLimitedSupply(badge: BadgeType): boolean {
  return badge.max_supply !== null
}

export function supplyRemaining(badge: BadgeType): number | null {
  if (badge.max_supply === null) return null
  return Math.max(0, badge.max_supply - badge.total_issued)
}
