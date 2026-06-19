import { describe, it, expect } from 'vitest'
import { formatCompact, formatPct, formatMeloAmount } from '@/lib/format-number'

describe('formatCompact', () => {
  it('returns raw number for values under 1000', () => {
    expect(formatCompact(0)).toBe('0')
    expect(formatCompact(999)).toBe('999')
  })

  it('formats thousands with K suffix', () => {
    expect(formatCompact(1000)).toBe('1.0K')
    expect(formatCompact(1500)).toBe('1.5K')
    expect(formatCompact(999_999)).toBe('1000.0K')
  })

  it('formats millions with M suffix', () => {
    expect(formatCompact(1_000_000)).toBe('1.0M')
    expect(formatCompact(2_500_000)).toBe('2.5M')
  })
})

describe('formatPct', () => {
  it('formats percentage with 1 decimal by default', () => {
    expect(formatPct(75)).toBe('75.0%')
    expect(formatPct(0)).toBe('0.0%')
    expect(formatPct(100)).toBe('100.0%')
  })

  it('respects custom decimal places', () => {
    expect(formatPct(33.333, 2)).toBe('33.33%')
    expect(formatPct(50, 0)).toBe('50%')
  })
})

describe('formatMeloAmount', () => {
  it('formats number to 3 decimal places', () => {
    expect(formatMeloAmount(1)).toBe('1.000')
    expect(formatMeloAmount(1.5)).toBe('1.500')
  })

  it('formats string to 3 decimal places', () => {
    expect(formatMeloAmount('2.1')).toBe('2.100')
    expect(formatMeloAmount('0.5')).toBe('0.500')
  })
})
