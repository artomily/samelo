import { describe, it, expect } from 'vitest'
import { STAKING_TIERS } from '@/lib/types/staking'

// Logic extracted from /api/staking/multiplier
function effectiveMultiplier(positions: { bonus_multiplier: string; unlock_at: string }[]): number {
  const now = new Date()
  const active = positions.filter(p => new Date(p.unlock_at) > now)
  return active.reduce((max, r) => Math.max(max, parseFloat(r.bonus_multiplier)), 1.0)
}

describe('effectiveMultiplier', () => {
  it('returns 1.0 with no positions', () => {
    expect(effectiveMultiplier([])).toBe(1.0)
  })

  it('returns 1.0 when all positions are expired', () => {
    const expired = [{ bonus_multiplier: '1.35', unlock_at: '2020-01-01T00:00:00Z' }]
    expect(effectiveMultiplier(expired)).toBe(1.0)
  })

  it('returns highest multiplier across active positions', () => {
    const future = new Date(Date.now() + 86_400_000).toISOString()
    const positions = [
      { bonus_multiplier: '1.05', unlock_at: future },
      { bonus_multiplier: '1.75', unlock_at: future },
    ]
    expect(effectiveMultiplier(positions)).toBe(1.75)
  })

  it('ignores expired positions when mixed with active', () => {
    const future = new Date(Date.now() + 86_400_000).toISOString()
    const positions = [
      { bonus_multiplier: '1.75', unlock_at: '2020-01-01T00:00:00Z' }, // expired
      { bonus_multiplier: '1.05', unlock_at: future }, // active
    ]
    expect(effectiveMultiplier(positions)).toBe(1.05)
  })
})

describe('STAKING_TIERS bonus multiplier values', () => {
  it('1-week tier has 1.05 multiplier', () => {
    expect(STAKING_TIERS.find(t => t.lockDays === 7)!.bonusMultiplier).toBe(1.05)
  })

  it('6-month tier has 1.75 multiplier', () => {
    expect(STAKING_TIERS.find(t => t.lockDays === 180)!.bonusMultiplier).toBe(1.75)
  })
})
