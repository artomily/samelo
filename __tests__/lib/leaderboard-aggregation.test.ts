import { describe, it, expect } from 'vitest'

// Logic extracted from /api/onchain/leaderboard-swappers
interface SwapRow {
  wallet_address: string
  points_burned: number
  melo_received: string
}

function aggregateSwappers(rows: SwapRow[]) {
  const walletMap = new Map<string, { pointsBurned: number; meloReceived: number; swapCount: number }>()
  for (const row of rows) {
    const existing = walletMap.get(row.wallet_address) ?? { pointsBurned: 0, meloReceived: 0, swapCount: 0 }
    walletMap.set(row.wallet_address, {
      pointsBurned: existing.pointsBurned + row.points_burned,
      meloReceived: existing.meloReceived + parseFloat(row.melo_received),
      swapCount: existing.swapCount + 1,
    })
  }
  return Array.from(walletMap.entries())
    .sort((a, b) => b[1].meloReceived - a[1].meloReceived)
    .map(([wallet, stats], i) => ({ rank: i + 1, wallet, ...stats }))
}

describe('aggregateSwappers', () => {
  it('sums melo_received per wallet', () => {
    const rows = [
      { wallet_address: '0xA', points_burned: 1000, melo_received: '1.000' },
      { wallet_address: '0xA', points_burned: 500, melo_received: '0.500' },
    ]
    const result = aggregateSwappers(rows)
    expect(result[0].wallet).toBe('0xA')
    expect(result[0].meloReceived).toBeCloseTo(1.5)
    expect(result[0].swapCount).toBe(2)
  })

  it('ranks wallets by descending MELO', () => {
    const rows = [
      { wallet_address: '0xA', points_burned: 500, melo_received: '0.500' },
      { wallet_address: '0xB', points_burned: 2000, melo_received: '2.000' },
    ]
    const result = aggregateSwappers(rows)
    expect(result[0].wallet).toBe('0xB')
    expect(result[0].rank).toBe(1)
    expect(result[1].wallet).toBe('0xA')
    expect(result[1].rank).toBe(2)
  })

  it('returns empty array for no rows', () => {
    expect(aggregateSwappers([])).toHaveLength(0)
  })

  it('handles single wallet with single swap', () => {
    const rows = [{ wallet_address: '0xC', points_burned: 1000, melo_received: '1.000' }]
    const result = aggregateSwappers(rows)
    expect(result).toHaveLength(1)
    expect(result[0].rank).toBe(1)
    expect(result[0].pointsBurned).toBe(1000)
  })
})
