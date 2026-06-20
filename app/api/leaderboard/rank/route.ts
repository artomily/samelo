import { NextRequest, NextResponse } from 'next/server'
import { getWalletRank } from '@/lib/leaderboard'
import type { LeaderboardPeriod } from '@/lib/types/leaderboard'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address') ?? ''
  if (!/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const period = (req.nextUrl.searchParams.get('period') ?? 'weekly') as LeaderboardPeriod
  const snapshot = await getWalletRank(wallet, period)

  return NextResponse.json({ rank: snapshot?.rank ?? null, points: snapshot?.points ?? 0 })
}
