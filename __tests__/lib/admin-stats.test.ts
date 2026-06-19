import { describe, it, expect } from 'vitest'

// Logic extracted from /api/admin/stats aggregation
function calcAdminMetrics(
  pointsRows: { reward_cents: number }[],
  burnRows: { points_burned: number }[],
  meloRows: { melo_received: string }[],
) {
  const totalPointsIssued = pointsRows.reduce((s, r) => s + r.reward_cents, 0)
  const totalPointsBurned = burnRows.reduce((s, r) => s + r.points_burned, 0)
  const totalMeloMinted = meloRows.reduce((s, r) => s + parseFloat(r.melo_received), 0)
  return { totalPointsIssued, totalPointsBurned, totalMeloMinted }
}

describe('calcAdminMetrics', () => {
  it('sums points issued correctly', () => {
    const result = calcAdminMetrics(
      [{ reward_cents: 100 }, { reward_cents: 200 }],
      [],
      [],
    )
    expect(result.totalPointsIssued).toBe(300)
  })

  it('sums points burned correctly', () => {
    const result = calcAdminMetrics([], [{ points_burned: 500 }, { points_burned: 300 }], [])
    expect(result.totalPointsBurned).toBe(800)
  })

  it('sums MELO minted with string parsing', () => {
    const result = calcAdminMetrics([], [], [{ melo_received: '1.500' }, { melo_received: '0.500' }])
    expect(result.totalMeloMinted).toBeCloseTo(2.0)
  })

  it('returns zeros for empty input', () => {
    const result = calcAdminMetrics([], [], [])
    expect(result).toEqual({ totalPointsIssued: 0, totalPointsBurned: 0, totalMeloMinted: 0 })
  })
})
