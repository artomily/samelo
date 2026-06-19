import { describe, it, expect } from 'vitest'
import { pointsToMelo, meloToPoints, formatMelo, POINTS_PER_MELO } from '@/lib/melo-token'

describe('POINTS_PER_MELO', () => {
  it('is 1000', () => {
    expect(POINTS_PER_MELO).toBe(1000)
  })
})

describe('pointsToMelo', () => {
  it('converts 1000 points to 1 MELO', () => {
    expect(pointsToMelo(1000)).toBe(1)
  })

  it('converts 500 points to 0.5 MELO', () => {
    expect(pointsToMelo(500)).toBe(0.5)
  })

  it('converts 0 points to 0 MELO', () => {
    expect(pointsToMelo(0)).toBe(0)
  })
})

describe('meloToPoints', () => {
  it('converts 1 MELO to 1000 points', () => {
    expect(meloToPoints(1)).toBe(1000)
  })

  it('floors fractional conversions', () => {
    expect(meloToPoints(0.5009)).toBe(500)
  })
})

describe('formatMelo', () => {
  it('formats 1 MELO (10^18 raw)', () => {
    const raw = BigInt('1000000000000000000')
    expect(formatMelo(raw)).toBe('1.000')
  })

  it('formats 1234.567 MELO', () => {
    const raw = BigInt('1234567000000000000000')
    expect(formatMelo(raw)).toBe('1,234.567')
  })

  it('formats 0 MELO', () => {
    expect(formatMelo(BigInt(0))).toBe('0.000')
  })
})
