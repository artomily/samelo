import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { validateWallet } from '@/lib/middleware/validate-wallet'

// GET /api/onchain/user-flow?walletAddress=0x...
// Returns the personal money flow breakdown for a single wallet
export async function GET(request: NextRequest) {
  const walletParam = request.nextUrl.searchParams.get('walletAddress')
  if (!walletParam) {
    return NextResponse.json({ error: 'walletAddress is required' }, { status: 400 })
  }

  const validation = validateWallet(walletParam)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const wallet = validation.address!
  const supabase = getServiceSupabase()

  try {
    const [watchesResult, swapsResult, profile] = await Promise.all([
      supabase
        .from('watches')
        .select('reward_cents, watched_at')
        .eq('wallet_address', wallet)
        .order('watched_at', { ascending: false }),
      supabase
        .from('point_swaps')
        .select('points_burned, melo_received, tx_hash, created_at')
        .eq('wallet_address', wallet)
        .order('created_at', { ascending: false }),
      supabase
        .from('profiles')
        .select('total_points, referral_code')
        .eq('wallet_address', wallet)
        .maybeSingle(),
    ])

    const watches = watchesResult.data ?? []
    const swaps = swapsResult.data ?? []

    const totalPointsEarned = watches.reduce((s, w) => s + (w.reward_cents ?? 0), 0)
    const totalPointsBurned = swaps.reduce((s, sw) => s + (sw.points_burned ?? 0), 0)
    const totalMeloReceived = swaps.reduce((s, sw) => s + parseFloat(sw.melo_received ?? '0'), 0)
    const currentPoints = profile.data?.total_points ?? 0

    return NextResponse.json({
      wallet,
      totalWatches: watches.length,
      totalPointsEarned,
      totalPointsBurned,
      totalMeloReceived: totalMeloReceived.toFixed(3),
      currentPoints,
      swapCount: swaps.length,
      conversionRate: totalPointsEarned > 0
        ? ((totalPointsBurned / totalPointsEarned) * 100).toFixed(1)
        : '0.0',
      recentSwaps: swaps.slice(0, 5).map((s) => ({
        pointsBurned: s.points_burned,
        meloReceived: s.melo_received,
        txHash: s.tx_hash,
        createdAt: s.created_at,
      })),
    })
  } catch (err) {
    console.error('[/api/onchain/user-flow]', err)
    return NextResponse.json({ error: 'Failed to fetch user flow' }, { status: 500 })
  }
}
