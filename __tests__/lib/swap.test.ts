import { describe, it, expect } from 'vitest'
import {
  formatPriceImpact,
  isHighPriceImpact,
  calcMinimumOut,
  MAX_SLIPPAGE_BPS,
  MIN_SLIPPAGE_BPS,
  QUOTE_TTL_SECONDS,
} from '../../lib/types/swap'

describe('formatPriceImpact', () => {
  it('shows < 0.01% for tiny impact', () => {
    expect(formatPriceImpact(0.001)).toBe('< 0.01%')
  })

  it('formats normal impact to 2 decimal places', () => {
    expect(formatPriceImpact(1.5)).toBe('1.50%')
  })

  it('formats zero as < 0.01%', () => {
    expect(formatPriceImpact(0)).toBe('< 0.01%')
  })
})

describe('isHighPriceImpact', () => {
  it('returns false for <= 2%', () => {
    expect(isHighPriceImpact(2.0)).toBe(false)
  })

  it('returns true for > 2%', () => {
    expect(isHighPriceImpact(2.01)).toBe(true)
  })
})

describe('calcMinimumOut', () => {
  it('subtracts slippage correctly', () => {
    expect(calcMinimumOut(1000, 50)).toBeCloseTo(995, 1)
  })

  it('returns full amount for 0 slippage', () => {
    expect(calcMinimumOut(1000, 0)).toBe(1000)
  })
})

describe('swap constants', () => {
  it('max slippage is 500 bps (5%)', () => {
    expect(MAX_SLIPPAGE_BPS).toBe(500)
  })

  it('min slippage is 10 bps (0.1%)', () => {
    expect(MIN_SLIPPAGE_BPS).toBe(10)
  })

  it('quote TTL is 30 seconds', () => {
    expect(QUOTE_TTL_SECONDS).toBe(30)
  })
})
