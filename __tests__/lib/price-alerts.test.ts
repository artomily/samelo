import { describe, it, expect } from 'vitest'
import {
  CONDITION_LABELS,
  alertDescription,
  isTriggered,
  shouldTrigger,
} from '@/lib/types/price-alerts'
import type { PriceAlert } from '@/lib/types/price-alerts'

function makeAlert(overrides: Partial<PriceAlert> = {}): PriceAlert {
  return {
    id: 'a1',
    wallet: '0xabc',
    token_symbol: 'MELO',
    condition: 'above',
    target_price: 1.0,
    is_active: true,
    triggered_at: null,
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('CONDITION_LABELS', () => {
  it('has label for above and below', () => {
    expect(CONDITION_LABELS.above).toContain('above')
    expect(CONDITION_LABELS.below).toContain('below')
  })
})

describe('alertDescription', () => {
  it('builds readable description', () => {
    const desc = alertDescription(makeAlert({ condition: 'above', target_price: 2.5 }))
    expect(desc).toContain('above')
    expect(desc).toContain('2.5000')
    expect(desc).toContain('MELO')
  })
})

describe('isTriggered', () => {
  it('returns true when triggered_at is set', () => {
    expect(isTriggered(makeAlert({ triggered_at: '2026-01-02T00:00:00Z' }))).toBe(true)
  })

  it('returns false when triggered_at is null', () => {
    expect(isTriggered(makeAlert())).toBe(false)
  })
})

describe('shouldTrigger', () => {
  it('triggers above when price meets target', () => {
    expect(shouldTrigger(makeAlert({ condition: 'above', target_price: 1.0 }), 1.5)).toBe(true)
  })

  it('does not trigger above when price is below', () => {
    expect(shouldTrigger(makeAlert({ condition: 'above', target_price: 2.0 }), 1.5)).toBe(false)
  })

  it('triggers below when price meets target', () => {
    expect(shouldTrigger(makeAlert({ condition: 'below', target_price: 1.0 }), 0.5)).toBe(true)
  })

  it('returns false when already triggered', () => {
    expect(shouldTrigger(makeAlert({ triggered_at: '2026-01-02T00:00:00Z' }), 999)).toBe(false)
  })

  it('returns false when inactive', () => {
    expect(shouldTrigger(makeAlert({ is_active: false }), 999)).toBe(false)
  })
})
