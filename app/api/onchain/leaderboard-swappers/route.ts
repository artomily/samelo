import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

// GET /api/onchain/leaderboard-swappers
// Top 10 wallets by total $MELO swapped — the on-chain power users
export async function GET() {
  const supabase = getServiceSupabase()

  try {
    const { data, error } = await supabase
      .from('point_swaps')
      .select('wallet_address, points_burned, melo_received')
      .limit(500)

    if (error) throw error

    // Aggregate by wallet
    const walletMap = new Map<string, { pointsBurned: number; meloReceived: number; swapCount: number }>()
    for (const row of data ?? []) {
      const existing = walletMap.get(row.wallet_address) ?? { pointsBurned: 0, meloReceived: 0, swapCount: 0 }
      walletMap.set(row.wallet_address, {
        pointsBurned: existing.pointsBurned + (row.points_burned ?? 0),
        meloReceived: existing.meloReceived + parseFloat(row.melo_received ?? '0'),
        swapCount: existing.swapCount + 1,
      })
    }

    const leaders = Array.from(walletMap.entries())
      .sort((a, b) => b[1].meloReceived - a[1].meloReceived)
      .slice(0, 10)
      .map(([wallet, stats], i) => ({
        rank: i + 1,
        wallet: `${wallet.slice(0, 6)}…${wallet.slice(-4)}`,
        walletFull: wallet,
        totalPointsBurned: stats.pointsBurned,
        totalMelo: stats.meloReceived.toFixed(3),
        swapCount: stats.swapCount,
      }))

    return NextResponse.json({ leaders })
  } catch (err) {
    console.error('[/api/onchain/leaderboard-swappers]', err)
    return NextResponse.json({ error: 'Failed to fetch swapper leaderboard' }, { status: 500 })
  }
}
