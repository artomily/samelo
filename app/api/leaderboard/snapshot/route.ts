import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { computeAndSnapshotLeaderboard } from '@/lib/leaderboard'
import type { LeaderboardPeriod } from '@/lib/types/leaderboard'

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!isAdmin(wallet)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { period } = await req.json()
  const valid: LeaderboardPeriod[] = ['daily', 'weekly', 'alltime']
  if (!valid.includes(period)) {
    return NextResponse.json({ error: 'Invalid period' }, { status: 400 })
  }

  await computeAndSnapshotLeaderboard(period)
  return NextResponse.json({ ok: true, period })
}
