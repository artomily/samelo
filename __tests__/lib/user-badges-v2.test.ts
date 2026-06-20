import { describe, it, expect } from 'vitest'
import {
  BADGE_RARITY_COLORS,
  isLimitedSupply,
  supplyRemaining,
} from '@/lib/types/user-badges-v2'
import type { BadgeType } from '@/lib/types/user-badges-v2'

function makeBadge(overrides: Partial<BadgeType> = {}): BadgeType {
  return {
    id: 'test-id',
    slug: 'test-badge',
    name: 'Test Badge',
    description: 'desc',
    category: 'platform',
    rarity: 'common',
    image_url: null,
    animated_url: null,
    background_color: '#1a1a1a',
    is_transferable: false,
    max_supply: null,
    total_issued: 0,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('BADGE_RARITY_COLORS', () => {
  it('assigns neon lime to legendary', () => {
    expect(BADGE_RARITY_COLORS.legendary).toBe('#c8f135')
  })

  it('covers all rarities', () => {
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const
    for (const r of rarities) {
      expect(BADGE_RARITY_COLORS[r]).toBeTruthy()
    }
  })
})

describe('isLimitedSupply', () => {
  it('returns true when max_supply is set', () => {
    expect(isLimitedSupply(makeBadge({ max_supply: 100 }))).toBe(true)
  })

  it('returns false when max_supply is null', () => {
    expect(isLimitedSupply(makeBadge({ max_supply: null }))).toBe(false)
  })
})

describe('supplyRemaining', () => {
  it('returns null for unlimited badges', () => {
    expect(supplyRemaining(makeBadge({ max_supply: null }))).toBeNull()
  })

  it('returns remaining supply', () => {
    expect(supplyRemaining(makeBadge({ max_supply: 100, total_issued: 40 }))).toBe(60)
  })

  it('clamps at zero when over-issued', () => {
    expect(supplyRemaining(makeBadge({ max_supply: 10, total_issued: 15 }))).toBe(0)
  })
})
