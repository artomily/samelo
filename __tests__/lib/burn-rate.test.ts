import { describe, it, expect } from 'vitest'

function calcBurnRate(burned: number, issued: number): number {
  if (issued === 0) return 0
  return (burned / issued) * 100
}

function burnRateLabel(rate: number): string {
  if (rate >= 80) return 'Excellent'
  if (rate >= 50) return 'Healthy'
  if (rate >= 20) return 'Growing'
  return 'Early'
}

describe('calcBurnRate', () => {
  it('returns 0 when no points issued', () => {
    expect(calcBurnRate(0, 0)).toBe(0)
  })

  it('returns 100 when all points burned', () => {
    expect(calcBurnRate(1000, 1000)).toBe(100)
  })

  it('returns 50 when half burned', () => {
    expect(calcBurnRate(500, 1000)).toBe(50)
  })

  it('handles fractional values', () => {
    expect(calcBurnRate(333, 1000)).toBeCloseTo(33.3)
  })
})

describe('burnRateLabel', () => {
  it('returns Excellent at 80+', () => {
    expect(burnRateLabel(80)).toBe('Excellent')
    expect(burnRateLabel(100)).toBe('Excellent')
  })

  it('returns Healthy at 50–79', () => {
    expect(burnRateLabel(50)).toBe('Healthy')
    expect(burnRateLabel(79)).toBe('Healthy')
  })

  it('returns Growing at 20–49', () => {
    expect(burnRateLabel(20)).toBe('Growing')
    expect(burnRateLabel(49)).toBe('Growing')
  })

  it('returns Early below 20', () => {
    expect(burnRateLabel(0)).toBe('Early')
    expect(burnRateLabel(19)).toBe('Early')
  })
})
