import { describe, it, expect } from 'vitest'
import {
  SOURCE_LABELS,
  DEFAULT_SPLIT,
  splitRevenue,
  hasCollab,
} from '@/lib/types/revenue-sharing'
import type { RevenueSplit } from '@/lib/types/revenue-sharing'

function makeSplit(overrides: Partial<RevenueSplit> = {}): RevenueSplit {
  return {
    id: 's1',
    video_id: 'v1',
    creator_wallet: '0xabc',
    creator_pct: 80,
    platform_pct: 20,
    collab_wallet: null,
    collab_pct: 0,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('SOURCE_LABELS', () => {
  it('labels all revenue sources', () => {
    expect(SOURCE_LABELS.ad).toBe('Ad Revenue')
    expect(SOURCE_LABELS.tip).toBe('Tips')
    expect(SOURCE_LABELS.subscription).toBe('Subscriptions')
    expect(SOURCE_LABELS.course).toBe('Courses')
    expect(SOURCE_LABELS.nft).toBe('NFT Sales')
  })
})

describe('DEFAULT_SPLIT', () => {
  it('sums to 100', () => {
    const { creator_pct, platform_pct, collab_pct } = DEFAULT_SPLIT
    expect(creator_pct + platform_pct + collab_pct).toBe(100)
  })
})

describe('splitRevenue', () => {
  it('splits 100 MELO 80/20', () => {
    const result = splitRevenue(100, { creator_pct: 80, platform_pct: 20, collab_pct: 0 })
    expect(result.creator).toBe(80)
    expect(result.platform).toBe(20)
    expect(result.collab).toBe(0)
  })

  it('handles 3-way split', () => {
    const result = splitRevenue(100, { creator_pct: 70, platform_pct: 20, collab_pct: 10 })
    expect(result.creator).toBe(70)
    expect(result.collab).toBe(10)
    expect(result.platform).toBe(20)
  })

  it('floors partial amounts so platform absorbs remainder', () => {
    const result = splitRevenue(10, { creator_pct: 33, platform_pct: 67, collab_pct: 0 })
    expect(result.creator + result.platform + result.collab).toBe(10)
  })
})

describe('hasCollab', () => {
  it('returns true when collab_wallet and pct are set', () => {
    expect(hasCollab(makeSplit({ collab_wallet: '0xcollab', collab_pct: 10 }))).toBe(true)
  })

  it('returns false when no collab', () => {
    expect(hasCollab(makeSplit())).toBe(false)
  })
})
