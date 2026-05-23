import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAddress } from 'viem'

const FAUCET_VIDEO_ID = '__earn_faucet__'
const POINTS_PER_CLICK = 10

// When called without a txHash (no contract), enforce 1-hour server-side rate limit
const FALLBACK_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const FALLBACK_MAX_PER_WINDOW = 10

/**
 * POST /api/rewards/earn-points
 *
 * Syncs an on-chain earn event to Supabase, or credits points directly
 * when the SameloPoints contract is not yet deployed.
 *
 * Body: { walletAddress: string, txHash?: string }
 *       txHash — present when called after a confirmed on-chain earn()
 *
 * Returns: { points: number, total: number }
 */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { walletAddress, txHash } = body as Record<string, unknown>

  if (typeof walletAddress !== 'string' || !isAddress(walletAddress)) {
    return NextResponse.json({ error: 'Valid walletAddress required' }, { status: 400 })
  }

  const supabase = getServiceSupabase()

  // When no txHash — contract not deployed yet; apply server-side rate limit
  if (!txHash) {
    const windowStart = new Date(Date.now() - FALLBACK_RATE_LIMIT_WINDOW_MS).toISOString()
    const { count } = await supabase
      .from('watches')
      .select('*', { count: 'exact', head: true })
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('video_id', FAUCET_VIDEO_ID)
      .gte('watched_at', windowStart)

    if ((count ?? 0) >= FALLBACK_MAX_PER_WINDOW) {
      return NextResponse.json(
        { error: `Rate limit: max ${FALLBACK_MAX_PER_WINDOW} earns per hour` },
        { status: 429 },
      )
    }
  } else {
    // When txHash is present — deduplicate by tx hash to prevent double-credit
    if (typeof txHash !== 'string' || !/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
      return NextResponse.json({ error: 'Invalid txHash format' }, { status: 400 })
    }

    const { data: existing } = await supabase
      .from('watches')
      .select('id')
      .eq('video_id', FAUCET_VIDEO_ID)
      .eq('wallet_address', walletAddress.toLowerCase())
      // store txHash in notes field — reuse watched_at uniqueness proxy
      .limit(1)
      .maybeSingle()

    // Check for duplicate txHash using a dedicated query
    const { data: dupRow } = await supabase
      .from('watches')
      .select('id')
      .eq('video_id', FAUCET_VIDEO_ID)
      // We store txHash in a future notes column; for now check via recent window (1 min)
      // to prevent accidental double-submit
      .eq('wallet_address', walletAddress.toLowerCase())
      .gte('watched_at', new Date(Date.now() - 60_000).toISOString())
      .maybeSingle()

    if (dupRow) {
      // Already synced recently — return existing total without re-inserting
      const { data: rows } = await supabase
        .from('watches')
        .select('reward_cents')
        .eq('wallet_address', walletAddress.toLowerCase())
        .eq('claimed', false)
      const total = (rows ?? []).reduce((s, r) => s + (r.reward_cents ?? 0), 0)
      return NextResponse.json({ points: 0, total, duplicate: true })
    }

    void existing // suppress unused
  }

  // Ensure the faucet system video exists (inactive — never shown in feed)
  await supabase.from('videos').upsert(
    {
      id: FAUCET_VIDEO_ID,
      title: 'Earn Points (Faucet)',
      duration_seconds: 0,
      reward_cents: POINTS_PER_CLICK,
      active: false,
    },
    { onConflict: 'id', ignoreDuplicates: true },
  )

  // Ensure profile row exists
  await supabase
    .from('profiles')
    .upsert(
      { wallet_address: walletAddress.toLowerCase() },
      { onConflict: 'wallet_address', ignoreDuplicates: true },
    )

  // Insert the earn event
  const { error: insertError } = await supabase.from('watches').insert({
    wallet_address: walletAddress.toLowerCase(),
    video_id: FAUCET_VIDEO_ID,
    reward_cents: POINTS_PER_CLICK,
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Return updated unclaimed total
  const { data: rows } = await supabase
    .from('watches')
    .select('reward_cents')
    .eq('wallet_address', walletAddress.toLowerCase())
    .eq('claimed', false)

  const total = (rows ?? []).reduce((s, r) => s + (r.reward_cents ?? 0), 0)

  return NextResponse.json({ points: POINTS_PER_CLICK, total })
}
