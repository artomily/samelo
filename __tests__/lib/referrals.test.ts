import { describe, it, expect } from 'vitest'
import {
  buildReferralUrl,
  isCapacityFull,
  remainingCapacity,
  conversionRate,
} from '@/lib/types/referrals'
import type { ReferralCode, ReferralConversion } from '@/lib/types/referrals'

function makeCode(overrides: Partial<ReferralCode> = {}): ReferralCode {
  return {
    id: 'ref1',
    wallet: '0xabc',
    code: 'ABC123',
    bonus_melo: 10,
    is_active: true,
    max_uses: null,
    total_uses: 0,
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function makeConversion(bonusPaid = false): ReferralConversion {
  return {
    id: 'c1',
    referral_code_id: 'ref1',
    referred_wallet: '0xdef',
    bonus_paid: bonusPaid,
    converted_at: '2026-01-02T00:00:00Z',
  }
}

describe('buildReferralUrl', () => {
  it('builds a URL with the code', () => {
    expect(buildReferralUrl('XYZ123', 'https://samelo.xyz')).toBe('https://samelo.xyz/join?ref=XYZ123')
  })

  it('works with empty base', () => {
    expect(buildReferralUrl('ABC')).toBe('/join?ref=ABC')
  })
})

describe('isCapacityFull', () => {
  it('returns false for unlimited codes', () => {
    expect(isCapacityFull(makeCode({ max_uses: null }))).toBe(false)
  })

  it('returns true when at capacity', () => {
    expect(isCapacityFull(makeCode({ max_uses: 5, total_uses: 5 }))).toBe(true)
  })

  it('returns false when under capacity', () => {
    expect(isCapacityFull(makeCode({ max_uses: 10, total_uses: 3 }))).toBe(false)
  })
})

describe('remainingCapacity', () => {
  it('returns null for unlimited', () => {
    expect(remainingCapacity(makeCode())).toBeNull()
  })

  it('returns remaining slots', () => {
    expect(remainingCapacity(makeCode({ max_uses: 10, total_uses: 3 }))).toBe(7)
  })

  it('clamps at 0', () => {
    expect(remainingCapacity(makeCode({ max_uses: 5, total_uses: 8 }))).toBe(0)
  })
})

describe('conversionRate', () => {
  it('returns 0 with no uses', () => {
    expect(conversionRate(makeCode(), [])).toBe(0)
  })

  it('calculates percentage of paid bonuses', () => {
    const code = makeCode({ total_uses: 4 })
    const convs = [makeConversion(true), makeConversion(true), makeConversion(false), makeConversion(false)]
    expect(conversionRate(code, convs)).toBe(50)
  })
})
