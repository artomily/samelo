import { describe, it, expect } from 'vitest'
import { formatPrice, formatChange, isPositiveChange, TRACKED_SYMBOLS } from '@/lib/types/price-feed'

describe('TRACKED_SYMBOLS', () => {
  it('includes CELO and MELO', () => {
    expect(TRACKED_SYMBOLS).toContain('CELO')
    expect(TRACKED_SYMBOLS).toContain('MELO')
  })
})

describe('formatPrice', () => {
  it('formats large prices with commas', () => {
    expect(formatPrice(1234.56)).toBe('$1,234.56')
  })

  it('formats sub-cent prices with 6 decimals', () => {
    expect(formatPrice(0.000123)).toBe('$0.000123')
  })

  it('formats sub-dollar prices with 4 decimals', () => {
    expect(formatPrice(0.05)).toBe('$0.0500')
  })
})

describe('formatChange', () => {
  it('formats positive change with +', () => {
    expect(formatChange(5.25)).toBe('+5.25%')
  })

  it('formats negative change without +', () => {
    expect(formatChange(-3.14)).toBe('-3.14%')
  })

  it('returns dash for null', () => {
    expect(formatChange(null)).toBe('—')
  })
})

describe('isPositiveChange', () => {
  it('returns true for positive', () => {
    expect(isPositiveChange(1.5)).toBe(true)
  })

  it('returns false for zero', () => {
    expect(isPositiveChange(0)).toBe(false)
  })

  it('returns false for null', () => {
    expect(isPositiveChange(null)).toBe(false)
  })

  it('returns false for negative', () => {
    expect(isPositiveChange(-2)).toBe(false)
  })
})
