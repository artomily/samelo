import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAddress } from 'viem'

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get('walletAddress')

  if (!wallet || !isAddress(wallet)) {
    return NextResponse.json({ error: 'Invalid walletAddress' }, { status: 400 })
  }

  const supabase = getServiceSupabase()
  const addr = wallet.toLowerCase()

  const [watchResult, quizResult] = await Promise.all([
    supabase
      .from('watches')
      .select('points, claimed, watched_at')
      .eq('wallet_address', addr),
    supabase
      .from('user_quiz_attempts')
      .select('points_earned')
      .eq('wallet_address', addr),
  ])

  const watches = watchResult.data ?? []
  const quizAttempts = quizResult.data ?? []

  const totalWatches = watches.length
  const totalPoints = watches.reduce((s, r) => s + (r.points ?? 0), 0)
    + quizAttempts.reduce((s, r) => s + (r.points_earned ?? 0), 0)
  const claimedPoints = watches
    .filter((r) => r.claimed)
    .reduce((s, r) => s + (r.points ?? 0), 0)
  const unclaimedPoints = totalPoints - claimedPoints
  const lastWatchedAt = watches.length
    ? watches.sort((a, b) => b.watched_at.localeCompare(a.watched_at))[0].watched_at
    : null

  return NextResponse.json({
    totalWatches,
    totalPoints,
    claimedPoints,
    unclaimedPoints,
    quizAttempts: quizAttempts.length,
    lastWatchedAt,
  })
}
