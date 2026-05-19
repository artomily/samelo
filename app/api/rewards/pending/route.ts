import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { isAddress } from 'viem'

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get('walletAddress')

  if (!wallet || !isAddress(wallet)) {
    return NextResponse.json(
      { error: 'Valid walletAddress is required' },
      { status: 400 },
    )
  }

  const db = getDb()

  const totalRow = db
    .prepare(
      `SELECT COALESCE(SUM(reward_cents), 0) AS total
       FROM watches
       WHERE wallet_address = ? AND claimed = 0`,
    )
    .get(wallet.toLowerCase()) as { total: number }

  const perVideo = db
    .prepare(
      `SELECT video_id, SUM(reward_cents) AS cents
       FROM watches
       WHERE wallet_address = ? AND claimed = 0
       GROUP BY video_id`,
    )
    .all(wallet.toLowerCase()) as { video_id: string; cents: number }[]

  return NextResponse.json({
    totalCents: totalRow.total,
    perVideo,
  })
}
