import { describe, it, expect } from 'vitest'
import { clamp, lerp, mapRange } from '@/lib/clamp'

describe('clamp', () => {
  it('returns value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it('clamps to min', () => {
    expect(clamp(-1, 0, 10)).toBe(0)
  })

  it('clamps to max', () => {
    expect(clamp(11, 0, 10)).toBe(10)
  })

  it('handles equal bounds', () => {
    expect(clamp(5, 5, 5)).toBe(5)
  })
})

describe('lerp', () => {
  it('returns start at t=0', () => {
    expect(lerp(10, 20, 0)).toBe(10)
  })

  it('returns end at t=1', () => {
    expect(lerp(10, 20, 1)).toBe(20)
  })

  it('returns midpoint at t=0.5', () => {
    expect(lerp(0, 100, 0.5)).toBe(50)
  })

  it('clamps t beyond 1', () => {
    expect(lerp(0, 100, 2)).toBe(100)
  })
})

describe('mapRange', () => {
  it('maps 50% of input range to 50% of output range', () => {
    expect(mapRange(5, 0, 10, 0, 100)).toBe(50)
  })

  it('maps minimum input to minimum output', () => {
    expect(mapRange(0, 0, 10, 0, 100)).toBe(0)
  })

  it('maps maximum input to maximum output', () => {
    expect(mapRange(10, 0, 10, 0, 100)).toBe(100)
  })
})
