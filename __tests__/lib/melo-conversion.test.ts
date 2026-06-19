import { describe, it, expect } from 'vitest'
import { pointsToMelo, meloToPoints } from '@/lib/melo-token'

describe('points ↔ MELO round-trip', () => {
  const cases = [
    [1000, 1],
    [2500, 2.5],
    [10000, 10],
    [500, 0.5],
  ] as const

  for (const [pts, melo] of cases) {
    it(`${pts} pts = ${melo} MELO`, () => {
      expect(pointsToMelo(pts)).toBe(melo)
    })

    it(`${melo} MELO = ${pts} pts`, () => {
      expect(meloToPoints(melo)).toBe(pts)
    })
  }
})

describe('meloToPoints floors correctly', () => {
  it('floors 1.9999 MELO to 1999 pts', () => {
    expect(meloToPoints(1.9999)).toBe(1999)
  })

  it('floors 0.001 MELO to 1 pt', () => {
    expect(meloToPoints(0.001)).toBe(1)
  })
})
