import { describe, it, expect } from 'vitest'
import type { TreasuryMetrics, FlowDay, RecentSwap } from '@/lib/types/onchain'

// Type-level tests — verify shape of types at compile time
describe('TreasuryMetrics shape', () => {
  it('accepts valid treasury metrics object', () => {
    const metrics: TreasuryMetrics = {
      totalWatches: 1000,
      totalWallets: 50,
      totalPointsDistributed: 50000,
      totalPointsBurned: 25000,
      totalMeloMinted: '25.000',
      claimedPoints: 20000,
      unclaimedPoints: 25000,
      swapCount: 30,
      funnel: {
        web2Events: 1000,
        pointsIssued: 50000,
        pointsBurned: 25000,
        meloOnChain: '25.000',
      },
    }
    expect(metrics.totalWatches).toBe(1000)
    expect(metrics.funnel.web2Events).toBe(1000)
  })
})

describe('FlowDay shape', () => {
  it('accepts valid flow day object', () => {
    const day: FlowDay = {
      date: '2026-06-19',
      watches: 42,
      pointsIssued: 4200,
      swaps: 5,
      meloMinted: '5.000',
    }
    expect(day.date).toBe('2026-06-19')
    expect(day.meloMinted).toBe('5.000')
  })
})

describe('RecentSwap shape', () => {
  it('accepts null txHash', () => {
    const swap: RecentSwap = {
      wallet: '0xabc…def',
      pointsBurned: 500,
      meloReceived: '0.500',
      txHash: null,
      createdAt: '2026-06-19T12:00:00Z',
    }
    expect(swap.txHash).toBeNull()
  })

  it('accepts txHash string', () => {
    const swap: RecentSwap = {
      wallet: '0xabc…def',
      pointsBurned: 1000,
      meloReceived: '1.000',
      txHash: '0xdeadbeef',
      createdAt: '2026-06-19T12:00:00Z',
    }
    expect(swap.txHash).toBe('0xdeadbeef')
  })
})
