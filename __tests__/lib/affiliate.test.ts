import { describe, it, expect } from 'vitest'
import { conversionRate, buildAffiliateUrl, generateSlug } from '@/lib/types/affiliate'
import type { AffiliateLink } from '@/lib/types/affiliate'

const makeLink = (overrides: Partial<AffiliateLink> = {}): AffiliateLink => ({
  id: 'l1',
  campaign_id: 'c1',
  affiliate_wallet: '0xABCDEF1234567890ABCDef1234567890ABCDEF12',
  slug: 'my-campaign-abcd',
  target_url: 'https://samelo.xyz',
  click_count: 100,
  conversion_count: 10,
  total_commission_melo: 5,
  is_active: true,
  created_at: '2026-06-21T00:00:00Z',
  ...overrides,
})

describe('conversionRate', () => {
  it('calculates conversion rate as percentage', () => {
    expect(conversionRate(makeLink())).toBe(10)
  })

  it('returns 0 when no clicks', () => {
    expect(conversionRate(makeLink({ click_count: 0, conversion_count: 0 }))).toBe(0)
  })

  it('rounds to 1 decimal place', () => {
    expect(conversionRate(makeLink({ click_count: 3, conversion_count: 1 }))).toBe(33.3)
  })
})

describe('buildAffiliateUrl', () => {
  it('builds URL with slug', () => {
    expect(buildAffiliateUrl('my-slug', 'https://samelo.xyz')).toBe('https://samelo.xyz/go/my-slug')
  })

  it('works with empty base', () => {
    expect(buildAffiliateUrl('my-slug')).toBe('/go/my-slug')
  })
})

describe('generateSlug', () => {
  it('lowercases and replaces spaces', () => {
    const slug = generateSlug('0xABCDEF1234567890ABCDef1234567890ABCDEF12', 'My Campaign')
    expect(slug).toMatch(/^my-campaign-/)
  })

  it('includes wallet suffix', () => {
    const slug = generateSlug('0xABCDEF1234567890ABCDef1234567890ABCDEF12', 'test')
    expect(slug.endsWith('-abcd')).toBe(true)
  })
})
