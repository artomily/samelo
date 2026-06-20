import { describe, it, expect } from 'vitest'
import { clamp, lerp, roundTo, percentOf, sum, average, median, pointsToMelo, meloToPoints } from '@/lib/utils/math'

describe('clamp', () => {
  it('clamps below min', () => { expect(clamp(-5, 0, 10)).toBe(0) })
  it('clamps above max', () => { expect(clamp(15, 0, 10)).toBe(10) })
  it('passes through in range', () => { expect(clamp(5, 0, 10)).toBe(5) })
})

describe('lerp', () => {
  it('returns start at t=0', () => { expect(lerp(0, 100, 0)).toBe(0) })
  it('returns end at t=1', () => { expect(lerp(0, 100, 1)).toBe(100) })
  it('returns midpoint at t=0.5', () => { expect(lerp(0, 100, 0.5)).toBe(50) })
})

describe('roundTo', () => {
  it('rounds to 2 decimal places', () => { expect(roundTo(1.555, 2)).toBe(1.56) })
  it('rounds integers', () => { expect(roundTo(42, 0)).toBe(42) })
})

describe('percentOf', () => {
  it('returns 0.5 for 50 of 100', () => { expect(percentOf(50, 100)).toBe(0.5) })
  it('returns 0 for total of 0', () => { expect(percentOf(10, 0)).toBe(0) })
  it('clamps to 1 max', () => { expect(percentOf(200, 100)).toBe(1) })
})

describe('sum', () => {
  it('sums array', () => { expect(sum([1, 2, 3])).toBe(6) })
  it('returns 0 for empty', () => { expect(sum([])).toBe(0) })
})

describe('average', () => {
  it('averages array', () => { expect(average([2, 4, 6])).toBe(4) })
  it('returns 0 for empty', () => { expect(average([])).toBe(0) })
})

describe('median', () => {
  it('finds median of odd array', () => { expect(median([1, 3, 5])).toBe(3) })
  it('finds median of even array', () => { expect(median([1, 2, 3, 4])).toBe(2.5) })
})

describe('pointsToMelo', () => {
  it('converts 1000 points to 1 MELO', () => { expect(pointsToMelo(1000)).toBe(1) })
  it('converts 500 points to 0.5 MELO', () => { expect(pointsToMelo(500)).toBe(0.5) })
})

describe('meloToPoints', () => {
  it('converts 1 MELO to 1000 points', () => { expect(meloToPoints(1)).toBe(1000) })
  it('floors fractional results', () => { expect(meloToPoints(0.5)).toBe(500) })
})
