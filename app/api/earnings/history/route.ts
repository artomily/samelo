import { NextRequest, NextResponse } from 'next/server'
import { getDb, WatchRow } from '@/lib/db'

const PAGE_SIZE = 20

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const walletAddress = searchParams.get('walletAddress')
  const cursor = parseInt(searchParams.get('cursor') ?? '0', 10)

  if (!walletAddress || !/^0x[0-9a-fA-F]{40}$/.test(walletAddress)) {
    return NextResponse.json({ error: 'Invalid walletAddress' }, { status: 400 })
  }

  const db = getDb()

  const rows = db
    .prepare(
      `SELECT id, video_id, reward_cents, watched_at, claimed
       FROM watches
       WHERE wallet_address = ?
         AND id > ?
       ORDER BY watched_at DESC
       LIMIT ?`,
    )
    .all(walletAddress, cursor, PAGE_SIZE + 1) as Pick<
      WatchRow,
      'id' | 'video_id' | 'reward_cents' | 'watched_at' | 'claimed'
    >[]

  const hasMore = rows.length > PAGE_SIZE
  const items = hasMore ? rows.slice(0, PAGE_SIZE) : rows
  const nextCursor = hasMore ? items[items.length - 1].id : null

  const totalRow = db
    .prepare(`SELECT SUM(reward_cents) as total FROM watches WHERE wallet_address = ?`)
    .get(walletAddress) as { total: number | null }

  const claimedRow = db
    .prepare(
      `SELECT SUM(reward_cents) as total FROM watches WHERE wallet_address = ? AND claimed = 1`,
    )
    .get(walletAddress) as { total: number | null }

  return NextResponse.json({
    items,
    nextCursor,
    totalEarnedCents: totalRow.total ?? 0,
    totalClaimedCents: claimedRow.total ?? 0,
  })
}
