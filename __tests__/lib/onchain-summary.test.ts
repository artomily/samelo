import { describe, it, expect } from 'vitest'
import { calcBurnRate, calcConversionEfficiency, calcAvgPointsPerWatch } from '@/lib/onchain-summary'

describe('calcBurnRate', () => {
  it('returns 0 when no points distributed', () => {
    expect(calcBurnRate({ totalPointsBurned: 0, totalPointsDistributed: 0 })).toBe(0)
  })

  it('returns 50% when half of points burned', () => {
    expect(calcBurnRate({ totalPointsBurned: 500, totalPointsDistributed: 1000 })).toBe(50)
  })

  it('returns 100% when all points burned', () => {
    expect(calcBurnRate({ totalPointsBurned: 1000, totalPointsDistributed: 1000 })).toBe(100)
  })
})

describe('calcConversionEfficiency', () => {
  it('returns 0 when no points distributed', () => {
    expect(calcConversionEfficiency({ totalMeloMinted: 0, totalPointsDistributed: 0 })).toBe(0)
  })

  it('calculates MELO per 100 points', () => {
    // 1 MELO per 1000 points = 0.1 MELO per 100 points
    expect(calcConversionEfficiency({ totalMeloMinted: 1, totalPointsDistributed: 1000 })).toBeCloseTo(0.1)
  })
})

describe('calcAvgPointsPerWatch', () => {
  it('returns 0 when no watches', () => {
    expect(calcAvgPointsPerWatch({ totalPointsDistributed: 0, totalWatches: 0 })).toBe(0)
  })

  it('returns average points per watch', () => {
    expect(calcAvgPointsPerWatch({ totalPointsDistributed: 1500, totalWatches: 100 })).toBe(15)
  })
})
