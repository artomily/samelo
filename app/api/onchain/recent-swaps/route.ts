import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

// GET /api/onchain/recent-swaps
// Returns the 10 most recent on-chain swaps for the live activity feed
export async function GET() {
  const supabase = getServiceSupabase()

  try {
    const { data, error } = await supabase
      .from('point_swaps')
      .select('wallet_address, points_burned, melo_received, tx_hash, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    const swaps = (data ?? []).map((s) => ({
      wallet: `${s.wallet_address.slice(0, 6)}…${s.wallet_address.slice(-4)}`,
      pointsBurned: s.points_burned,
      meloReceived: s.melo_received,
      txHash: s.tx_hash,
      createdAt: s.created_at,
    }))

    return NextResponse.json({ swaps })
  } catch (err) {
    console.error('[/api/onchain/recent-swaps]', err)
    return NextResponse.json({ error: 'Failed to fetch recent swaps' }, { status: 500 })
  }
}
