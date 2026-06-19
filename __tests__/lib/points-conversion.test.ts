import { describe, it, expect } from 'vitest'

// Points-to-MELO conversion used across swap flow
const POINTS_PER_MELO = 1000

function pointsToMelo(points: number): number {
  return points / POINTS_PER_MELO
}

function meloToPoints(melo: number): number {
  return Math.floor(melo * POINTS_PER_MELO)
}

function formatMeloDisplay(melo: number): string {
  return melo.toFixed(3)
}

describe('pointsToMelo', () => {
  it('converts minimum swap (500 pts) to 0.5 MELO', () => {
    expect(pointsToMelo(500)).toBe(0.5)
  })

  it('converts 1000 pts to exactly 1 MELO', () => {
    expect(pointsToMelo(1000)).toBe(1)
  })

  it('converts large amounts correctly', () => {
    expect(pointsToMelo(100_000)).toBe(100)
  })
})

describe('meloToPoints', () => {
  it('converts 1 MELO to 1000 pts', () => {
    expect(meloToPoints(1)).toBe(1000)
  })

  it('floors partial MELO', () => {
    expect(meloToPoints(1.9)).toBe(1900)
  })
})

describe('formatMeloDisplay', () => {
  it('shows 3 decimal places for whole number', () => {
    expect(formatMeloDisplay(1)).toBe('1.000')
  })

  it('shows 3 decimal places for fraction', () => {
    expect(formatMeloDisplay(0.5)).toBe('0.500')
  })

  it('rounds to 3 decimals', () => {
    expect(formatMeloDisplay(1.23456)).toBe('1.235')
  })
})
