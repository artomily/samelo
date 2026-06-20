import { describe, it, expect } from 'vitest'
import { netFlow, txTypeColor, CATEGORY_LABELS } from '@/lib/types/dao-treasury'
import type { TreasurySnapshot, TxCategory } from '@/lib/types/dao-treasury'

const makeSnapshot = (overrides: Partial<TreasurySnapshot> = {}): TreasurySnapshot => ({
  id: 's1',
  balance_melo: 10000,
  balance_cusd: 5000,
  total_inflow_melo: 15000,
  total_outflow_melo: 5000,
  snapshot_date: '2026-06-21',
  created_at: '2026-06-21T00:00:00Z',
  ...overrides,
})

describe('netFlow', () => {
  it('calculates net flow correctly', () => {
    expect(netFlow(makeSnapshot())).toBe(10000)
  })

  it('returns negative when outflow exceeds inflow', () => {
    const s = makeSnapshot({ total_inflow_melo: 1000, total_outflow_melo: 3000 })
    expect(netFlow(s)).toBe(-2000)
  })
})

describe('txTypeColor', () => {
  it('inflow is lime', () => {
    expect(txTypeColor('inflow')).toBe('#c8f135')
  })

  it('outflow is red', () => {
    expect(txTypeColor('outflow')).toBe('#f13535')
  })

  it('transfer is grey', () => {
    expect(txTypeColor('transfer')).toBe('#888')
  })
})

describe('CATEGORY_LABELS', () => {
  it('has labels for all categories', () => {
    const cats: TxCategory[] = [
      'protocol_fee', 'subscription', 'tip_fee', 'stake_reward', 'grant',
      'marketing', 'development', 'operations', 'reward_payout', 'other',
    ]
    for (const c of cats) {
      expect(CATEGORY_LABELS[c]).toBeTruthy()
    }
  })
})
