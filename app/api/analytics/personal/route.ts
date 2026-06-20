import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isValidAddress } from '@/lib/address'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')

  if (!wallet || !isValidAddress(wallet)) return apiError('MISSING_PARAMS', 'Valid wallet required', 400)

  const walletLower = wallet.toLowerCase()
  const supabase = getServiceSupabase()

  const [
    { count: totalWatches },
    { count: totalQuizzes },
    { count: totalReferrals },
    { data: watchPoints },
    { data: swaps },
    { data: profile },
  ] = await Promise.all([
    supabase.from('watches').select('*', { count: 'exact', head: true }).eq('wallet_address', walletLower),
    supabase.from('watches').select('*', { count: 'exact', head: true }).eq('wallet_address', walletLower).not('quiz_score', 'is', null),
    supabase.from('referrals').select('*', { count: 'exact', head: true }).eq('referrer_wallet', walletLower),
    supabase.from('watches').select('reward_cents').eq('wallet_address', walletLower),
    supabase.from('point_swaps').select('points_burned, melo_received').eq('wallet_address', walletLower),
    supabase.from('profiles').select('current_streak, longest_streak, total_points, xp, level, created_at').eq('wallet_address', walletLower).single(),
  ])

  const totalPointsEarned = (watchPoints ?? []).reduce((s, r) => s + (r.reward_cents ?? 0), 0)
  const totalPointsBurned = (swaps ?? []).reduce((s, r) => s + (r.points_burned ?? 0), 0)
  const totalMeloEarned = (swaps ?? []).reduce((s, r) => s + parseFloat(r.melo_received ?? '0'), 0)

  const memberSince = profile?.created_at
  const daysSinceJoined = memberSince
    ? Math.floor((Date.now() - new Date(memberSince).getTime()) / 86_400_000)
    : 0

  return apiOk({
    totalWatches: totalWatches ?? 0,
    totalQuizzes: totalQuizzes ?? 0,
    totalReferrals: totalReferrals ?? 0,
    totalPointsEarned,
    totalPointsBurned,
    totalMeloEarned,
    currentStreak: profile?.current_streak ?? 0,
    longestStreak: profile?.longest_streak ?? 0,
    xp: profile?.xp ?? 0,
    level: profile?.level ?? 1,
    daysSinceJoined,
    avgPointsPerDay: daysSinceJoined > 0 ? Math.round(totalPointsEarned / daysSinceJoined) : totalPointsEarned,
  })
}
