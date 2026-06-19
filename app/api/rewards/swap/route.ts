import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { validateWallet } from '@/lib/middleware/validate-wallet'

// POST /api/rewards/swap
// Body: { walletAddress, pointAmount, signature, nonce }
// Returns: { txHash, pointsSwapped, meloReceived }
//
// Note: actual on-chain transaction is submitted client-side via wagmi.
// This endpoint records the swap in the DB after confirmation.
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { walletAddress, pointAmount, txHash } = body as Record<string, unknown>

  if (!walletAddress || typeof walletAddress !== 'string') {
    return NextResponse.json({ error: 'walletAddress is required' }, { status: 400 })
  }
  if (!pointAmount || typeof pointAmount !== 'number' || pointAmount < 500) {
    return NextResponse.json({ error: 'pointAmount must be at least 500' }, { status: 400 })
  }
  if (!txHash || typeof txHash !== 'string') {
    return NextResponse.json({ error: 'txHash is required' }, { status: 400 })
  }

  const validation = validateWallet(walletAddress)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const wallet = validation.address!
  const supabase = getServiceSupabase()

  try {
    // Deduct points from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('total_points')
      .eq('wallet_address', wallet)
      .maybeSingle()

    if (profileError) throw profileError
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    if (profile.total_points < pointAmount) {
      return NextResponse.json({ error: 'Insufficient points' }, { status: 400 })
    }

    const meloReceived = (pointAmount / 1000).toFixed(3)

    // Record swap
    const { error: swapError } = await supabase.from('point_swaps').insert({
      wallet_address: wallet,
      points_burned: pointAmount,
      melo_received: meloReceived,
      tx_hash: txHash,
    })

    if (swapError && swapError.code !== '42P01') throw swapError

    await supabase
      .from('profiles')
      .update({ total_points: profile.total_points - pointAmount })
      .eq('wallet_address', wallet)

    return NextResponse.json({ txHash, pointsSwapped: pointAmount, meloReceived })
  } catch (err) {
    console.error('[/api/rewards/swap]', err)
    return NextResponse.json({ error: 'Swap recording failed' }, { status: 500 })
  }
}
