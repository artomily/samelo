import { NextRequest, NextResponse } from 'next/server'
import { getWatchStreak, recordWatchDay, getStreakCheckpoints, getLeaderboard } from '@/lib/watch-streaks'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  const mode = req.nextUrl.searchParams.get('mode')

  if (mode === 'leaderboard') {
    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? 20), 100)
    const board = await getLeaderboard(limit)
    return NextResponse.json({ leaderboard: board })
  }

  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const [streak, checkpoints] = await Promise.all([
    getWatchStreak(wallet),
    getStreakCheckpoints(wallet),
  ])

  return NextResponse.json({ streak, checkpoints })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { minutes_watched = 0 } = await req.json()
  const streak = await recordWatchDay(wallet, minutes_watched)
  return NextResponse.json({ streak })
}
