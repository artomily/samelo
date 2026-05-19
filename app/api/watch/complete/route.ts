import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyWatchToken } from '@/lib/watchToken'
import { MOCK_VIDEOS } from '@/lib/mock-videos'
import { isAddress } from 'viem'

const RATE_LIMIT_WINDOW_SECONDS = 60 * 60 * 24 // 24 hours

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

  const db = getDb()
  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - RATE_LIMIT_WINDOW_SECONDS

  // Rate-limit: 1 reward per wallet per video per 24 h
  const existing = db
    .prepare(
      `SELECT id FROM watches
       WHERE wallet_address = ? AND video_id = ? AND watched_at > ?`,
    )
    .get(walletAddress.toLowerCase(), videoId, windowStart)

  if (existing) {
    // Already earned today — return current pending without inserting
    const totalRow = db
      .prepare(
        `SELECT COALESCE(SUM(reward_cents), 0) AS total
         FROM watches
         WHERE wallet_address = ? AND claimed = 0`,
      )
      .get(walletAddress.toLowerCase()) as { total: number }

    return NextResponse.json({
      alreadyClaimed: true,
      totalPendingCents: totalRow.total,
    })
  }

  // Record the watch event
  db.prepare(
    `INSERT INTO watches (wallet_address, video_id, reward_cents, watched_at)
     VALUES (?, ?, ?, ?)`,
  ).run(walletAddress.toLowerCase(), videoId, video.rewardCents, now)

  const totalRow = db
    .prepare(
      `SELECT COALESCE(SUM(reward_cents), 0) AS total
       FROM watches
       WHERE wallet_address = ? AND claimed = 0`,
    )
    .get(walletAddress.toLowerCase()) as { total: number }

  return NextResponse.json({
    alreadyClaimed: false,
    rewardCents: video.rewardCents,
    totalPendingCents: totalRow.total,
  })
}
