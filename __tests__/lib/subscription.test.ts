import { describe, it, expect } from 'vitest'
import { isSubscriptionActive, subscriptionPrice, yearlyDiscount } from '@/lib/types/subscription'
import type { SubscriptionTier, UserSubscription } from '@/lib/types/subscription'

const makeTier = (overrides: Partial<SubscriptionTier> = {}): SubscriptionTier => ({
  id: 't1',
  name: 'pro',
  display_name: 'Pro',
  price_melo_monthly: 10,
  price_melo_yearly: 100,
  features: ['2x points'],
  max_watch_hours_per_day: null,
  bonus_points_pct: 25,
  is_active: true,
  sort_order: 1,
  created_at: '2026-06-21T00:00:00Z',
  ...overrides,
})

const makeSub = (overrides: Partial<UserSubscription> = {}): UserSubscription => ({
  id: 's1',
  wallet: '0x1234567890123456789012345678901234567890',
  tier_id: 't1',
  period: 'monthly',
  starts_at: '2026-06-21T00:00:00Z',
  ends_at: new Date(Date.now() + 86400_000 * 30).toISOString(),
  tx_hash: null,
  is_active: true,
  created_at: '2026-06-21T00:00:00Z',
  ...overrides,
})

describe('isSubscriptionActive', () => {
  it('returns true for active sub ending in the future', () => {
    expect(isSubscriptionActive(makeSub())).toBe(true)
  })

  it('returns false for expired sub', () => {
    const expired = makeSub({ ends_at: new Date(Date.now() - 1000).toISOString() })
    expect(isSubscriptionActive(expired)).toBe(false)
  })

  it('returns false when is_active is false', () => {
    expect(isSubscriptionActive(makeSub({ is_active: false }))).toBe(false)
  })
})

describe('subscriptionPrice', () => {
  it('returns monthly price for monthly period', () => {
    expect(subscriptionPrice(makeTier(), 'monthly')).toBe(10)
  })

  it('returns yearly price for yearly period', () => {
    expect(subscriptionPrice(makeTier(), 'yearly')).toBe(100)
  })
})

describe('yearlyDiscount', () => {
  it('calculates correct discount percentage', () => {
    // 10*12=120 monthly, 100 yearly → 17% discount
    expect(yearlyDiscount(makeTier())).toBe(17)
  })

  it('returns 0 for free tier', () => {
    expect(yearlyDiscount(makeTier({ price_melo_monthly: 0, price_melo_yearly: 0 }))).toBe(0)
  })
})
