import { describe, it, expect } from 'vitest'
import { formatNumber, formatPoints, formatMelo, formatPercent, formatDuration, formatCents, truncateAddress, truncateText } from '@/lib/utils/format'

describe('formatNumber', () => {
  it('formats millions', () => { expect(formatNumber(1_500_000)).toBe('1.5M') })
  it('formats thousands', () => { expect(formatNumber(2_500)).toBe('2.5K') })
  it('formats small numbers', () => { expect(formatNumber(42)).toBe('42') })
})

describe('formatPoints', () => {
  it('appends pts', () => { expect(formatPoints(1000)).toBe('1.0K pts') })
})

describe('formatMelo', () => {
  it('formats with 2 decimal places', () => { expect(formatMelo(1.5)).toBe('1.50 $MELO') })
})

describe('formatPercent', () => {
  it('formats 0.5 as 50.0%', () => { expect(formatPercent(0.5)).toBe('50.0%') })
  it('formats 1 as 100.0%', () => { expect(formatPercent(1)).toBe('100.0%') })
})

describe('formatDuration', () => {
  it('formats seconds', () => { expect(formatDuration(45)).toBe('45s') })
  it('formats minutes', () => { expect(formatDuration(125)).toBe('2m 5s') })
  it('formats hours', () => { expect(formatDuration(3661)).toBe('1h 1m') })
})

describe('formatCents', () => {
  it('formats 100 cents as $1.00', () => { expect(formatCents(100)).toBe('$1.00') })
  it('formats 50 cents as $0.50', () => { expect(formatCents(50)).toBe('$0.50') })
})

describe('truncateAddress', () => {
  it('truncates long address', () => {
    const addr = '0x742d35Cc6634C0532925a3b8D4C9b6c1d8e7f34c'
    expect(truncateAddress(addr)).toMatch(/^0x.{4}…/)
  })
})

describe('truncateText', () => {
  it('truncates and adds ellipsis', () => { expect(truncateText('hello world', 5)).toBe('hello…') })
  it('returns original if short', () => { expect(truncateText('hi', 10)).toBe('hi') })
})
