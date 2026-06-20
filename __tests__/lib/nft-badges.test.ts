import { describe, it, expect } from 'vitest'
import { RARITY_COLORS, RARITY_LABELS, isMinted } from '@/lib/types/nft-badge'
import type { NftBadgeDefinition, NftBadgeMint } from '@/lib/types/nft-badge'

function makeDef(overrides: Partial<NftBadgeDefinition> = {}): NftBadgeDefinition {
  return {
    id: 'badge-1',
    slug: 'test',
    name: 'Test Badge',
    description: 'A test badge',
    image_url: '/test.png',
    rarity: 'common',
    criteria_type: 'points',
    criteria_value: 100,
    supply_limit: null,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

function makeMint(badgeId: string, wallet: string): NftBadgeMint {
  return {
    id: 'mint-1',
    badge_id: badgeId,
    wallet,
    token_id: null,
    tx_hash: null,
    minted_at: new Date().toISOString(),
  }
}

describe('RARITY_COLORS', () => {
  it('has colors for all 5 rarities', () => {
    expect(Object.keys(RARITY_COLORS)).toHaveLength(5)
    expect(RARITY_COLORS.legendary).toBe('#c8f135')
  })
})

describe('RARITY_LABELS', () => {
  it('has labels for all rarities', () => {
    expect(RARITY_LABELS.common).toBe('Common')
    expect(RARITY_LABELS.legendary).toBe('Legendary')
  })
})

describe('isMinted', () => {
  it('returns true when wallet has minted this badge', () => {
    const def = makeDef({ id: 'badge-1' })
    const mints = [makeMint('badge-1', '0xabc')]
    expect(isMinted(def, mints)).toBe(true)
  })

  it('returns false when no mints', () => {
    const def = makeDef({ id: 'badge-1' })
    expect(isMinted(def, [])).toBe(false)
  })

  it('returns false when different badge minted', () => {
    const def = makeDef({ id: 'badge-1' })
    const mints = [makeMint('badge-2', '0xabc')]
    expect(isMinted(def, mints)).toBe(false)
  })
})
