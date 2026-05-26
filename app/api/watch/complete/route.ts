import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAddress } from 'viem'

const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { videoId, walletAddress } = body as Record<string, unknown>

  if (typeof videoId !== 'string' || typeof walletAddress !== 'string') {
    return NextResponse.json(
      { error: 'videoId and walletAddress are required strings' },
      { status: 400 },
    )
  }

  if (!isAddress(walletAddress)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  const supabase = getServiceSupabase()

  // Verify video exists in Supabase
  const { data: videoRow } = await supabase
    .from('videos')
    .select('reward_cents')
    .eq('id', videoId)
    .single()

  if (!videoRow) {
    return NextResponse.json({ error: 'Unknown video' }, { status: 404 })
  }

  const rewardPoints = videoRow.reward_cents as number

  // Ensure profile row exists (required by FK before inserting watch)
  await supabase
    .from('profiles')
    .upsert(
      { wallet_address: walletAddress.toLowerCase() },
      { onConflict: 'wallet_address', ignoreDuplicates: true },
    )

  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()

  // Rate-limit: 1 reward per wallet per video per 24 h
  const { data: existing } = await supabase
    .from('watches')
    .select('id')
    .eq('wallet_address', walletAddress.toLowerCase())
    .eq('video_id', videoId)
    .gte('watched_at', windowStart)
    .maybeSingle()

  if (existing) {
    // Already earned today — return current pending without inserting
    const { data: totalRow } = await supabase
      .from('watches')
      .select('reward_cents')
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('claimed', false)

    const totalPendingCents = (totalRow ?? []).reduce(
      (sum, r) => sum + (r.reward_cents ?? 0),
      0,
    )

    return NextResponse.json({ alreadyClaimed: true, totalPendingCents })
  }

  // Record the watch event in Supabase
  await supabase.from('watches').insert({
    wallet_address: walletAddress.toLowerCase(),
    video_id: videoId,
    reward_cents: rewardPoints,
    points: rewardPoints,
    watched_at: new Date().toISOString(),
  })

  const { data: allPending } = await supabase
    .from('watches')
    .select('reward_cents')
    .eq('wallet_address', walletAddress.toLowerCase())
    .eq('claimed', false)

  const totalPendingPoints = (allPending ?? []).reduce(
    (sum, r) => sum + (r.reward_cents ?? 0),
    0,
  )

  return NextResponse.json({
    alreadyClaimed: false,
    rewardPoints,
    totalPendingCents: totalPendingPoints,
    totalPendingPoints,
  })
}
