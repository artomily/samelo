export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
export type BadgeCriteriaType = 'points' | 'streak' | 'referrals' | 'videos_watched' | 'achievements'

export interface NftBadgeDefinition {
  id: string
  slug: string
  name: string
  description: string
  image_url: string
  rarity: BadgeRarity
  criteria_type: BadgeCriteriaType
  criteria_value: number
  supply_limit: number | null
  created_at: string
}

export interface NftBadgeMint {
  id: string
  badge_id: string
  wallet: string
  token_id: string | null
  tx_hash: string | null
  minted_at: string
}

export const RARITY_COLORS: Record<BadgeRarity, string> = {
  common: '#9ca3af',
  uncommon: '#34d399',
  rare: '#60a5fa',
  epic: '#a78bfa',
  legendary: '#c8f135',
}

export const RARITY_LABELS: Record<BadgeRarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
}

export function isMinted(badge: NftBadgeDefinition, mints: NftBadgeMint[]): boolean {
  return mints.some((m) => m.badge_id === badge.id)
}
