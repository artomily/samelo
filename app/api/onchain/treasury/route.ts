import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

// GET /api/onchain/treasury
// Returns aggregated on-chain treasury metrics for the dashboard
export async function GET() {
  const supabase = getServiceSupabase()

  try {
    const [
      watchesResult,
      swapsResult,
      profilesResult,
      claimsResult,
    ] = await Promise.all([
      // Total watches (Web2 engagement events)
      supabase.from('watches').select('reward_cents', { count: 'exact' }),
      // Total point swaps (Web3 redemptions)
      supabase.from('point_swaps').select('points_burned, melo_received').limit(1000),
      // Total unique wallets (users)
      supabase.from('profiles').select('wallet_address', { count: 'exact', head: true }),
      // Claimed rewards
      supabase.from('watches').select('reward_cents').eq('claimed', true),
    ])

    const watches = watchesResult.data ?? []
    const swaps = swapsResult.data ?? []
    const totalWatches = watchesResult.count ?? 0
    const totalWallets = profilesResult.count ?? 0

    const totalPointsDistributed = watches.reduce((s, w) => s + (w.reward_cents ?? 0), 0)
    const totalPointsBurned = swaps.reduce((s, sw) => s + (sw.points_burned ?? 0), 0)
    const totalMeloMinted = swaps.reduce((s, sw) => s + parseFloat(sw.melo_received ?? '0'), 0)
    const claimedPoints = (claimsResult.data ?? []).reduce((s, w) => s + (w.reward_cents ?? 0), 0)

    return NextResponse.json({
      totalWatches,
      totalWallets,
      totalPointsDistributed,
      totalPointsBurned,
      totalMeloMinted: totalMeloMinted.toFixed(3),
      claimedPoints,
      unclaimedPoints: totalPointsDistributed - totalPointsBurned,
      swapCount: swaps.length,
      // Conversion funnel: web2 → web3
      funnel: {
        web2Events: totalWatches,
        pointsIssued: totalPointsDistributed,
        pointsBurned: totalPointsBurned,
        meloOnChain: totalMeloMinted.toFixed(3),
      },
    })
  } catch (err) {
    console.error('[/api/onchain/treasury]', err)
    return NextResponse.json({ error: 'Failed to fetch treasury data' }, { status: 500 })
  }
}
