import { describe, it, expect } from 'vitest'
import { computeVestedAmount, getClaimableAmount } from '../../lib/types/vesting'
import type { VestingSchedule } from '../../lib/types/vesting'

function makeSchedule(overrides: Partial<VestingSchedule> = {}): VestingSchedule {
  const base: VestingSchedule = {
    id: 'test-id',
    wallet: '0xabc',
    total_melo: 1000,
    vested_melo: 0,
    cliff_at: '2024-01-01T00:00:00Z',
    vest_start: '2024-01-01T00:00:00Z',
    vest_end: '2025-01-01T00:00:00Z',
    category: 'team',
    claimed: false,
    created_at: '2023-12-01T00:00:00Z',
  }
  return { ...base, ...overrides }
}

describe('computeVestedAmount', () => {
  it('returns 0 before cliff', () => {
    const s = makeSchedule({ cliff_at: '2030-01-01T00:00:00Z' })
    expect(computeVestedAmount(s, new Date('2025-01-01'))).toBe(0)
  })

  it('returns total_melo after vest_end', () => {
    const s = makeSchedule()
    expect(computeVestedAmount(s, new Date('2026-01-01'))).toBe(1000)
  })

  it('returns ~50% at midpoint', () => {
    const s = makeSchedule()
    const mid = new Date('2024-07-02T12:00:00Z')
    const vested = computeVestedAmount(s, mid)
    expect(vested).toBeGreaterThan(490)
    expect(vested).toBeLessThan(510)
  })
})

describe('getClaimableAmount', () => {
  it('returns 0 when nothing vested', () => {
    const s = makeSchedule({ cliff_at: '2030-01-01T00:00:00Z' })
    expect(getClaimableAmount(s, new Date('2025-01-01'))).toBe(0)
  })

  it('subtracts already claimed amount', () => {
    const s = makeSchedule({ vested_melo: 500 })
    const all = computeVestedAmount(s, new Date('2026-01-01'))
    expect(getClaimableAmount(s, new Date('2026-01-01'))).toBe(all - 500)
  })

  it('never returns negative', () => {
    const s = makeSchedule({ vested_melo: 999, total_melo: 100 })
    expect(getClaimableAmount(s, new Date('2025-01-01'))).toBe(0)
  })
})
