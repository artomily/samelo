import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { verifyWatchToken } from '@/lib/watchToken'
import { MOCK_VIDEOS } from '@/lib/mock-videos'
import { isAddress } from 'viem'

const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { videoId, walletAddress, token } = body as Record<string, unknown>

  // Input validation
  if (
    typeof videoId !== 'string' ||
    typeof walletAddress !== 'string' ||
    typeof token !== 'string'
  ) {
    return NextResponse.json(
      { error: 'videoId, walletAddress, and token are required strings' },
      { status: 400 },
    )
  }

  if (!isAddress(walletAddress)) {
    return NextResponse.json(
      { error: 'Invalid wallet address' },
      { status: 400 },
    )
  }

  // Verify the HMAC watch token
  if (!verifyWatchToken(token, videoId, walletAddress)) {
    return NextResponse.json(
      { error: 'Invalid or expired watch token' },
      { status: 401 },
    )
  }

  // Verify video exists
  const video = MOCK_VIDEOS.find((v) => v.id === videoId)
  if (!video) {
    return NextResponse.json({ error: 'Unknown video' }, { status: 404 })
  }

  const supabase = getServiceSupabase()
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

  // Record the watch event
  await supabase.from('watches').insert({
    wallet_address: walletAddress.toLowerCase(),
    video_id: videoId,
    reward_cents: video.rewardCents,
    watched_at: new Date().toISOString(),
  })

  const { data: allPending } = await supabase
    .from('watches')
    .select('reward_cents')
    .eq('wallet_address', walletAddress.toLowerCase())
    .eq('claimed', false)

  const totalPendingCents = (allPending ?? []).reduce(
    (sum, r) => sum + (r.reward_cents ?? 0),
    0,
  )

  return NextResponse.json({
    alreadyClaimed: false,
    rewardCents: video.rewardCents,
    totalPendingCents,
  })
}
