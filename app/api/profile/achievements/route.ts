import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isValidAddress } from '@/lib/address'
import { getAchievements } from '@/lib/achievements'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get('wallet')

  if (!wallet || !isValidAddress(wallet)) {
    return apiError('MISSING_PARAMS', 'Valid wallet required', 400)
  }

  const supabase = getServiceSupabase()
  const walletLower = wallet.toLowerCase()

  const [
    { count: watchCount },
    { count: quizCount },
    { count: referralCount },
    { count: swapCount },
    { data: profile },
  ] = await Promise.all([
    supabase.from('watches').select('*', { count: 'exact', head: true }).eq('wallet_address', walletLower),
    supabase.from('watches').select('*', { count: 'exact', head: true }).eq('wallet_address', walletLower).not('quiz_score', 'is', null),
    supabase.from('referrals').select('*', { count: 'exact', head: true }).eq('referrer_wallet', walletLower),
    supabase.from('point_swaps').select('*', { count: 'exact', head: true }).eq('wallet_address', walletLower),
    supabase.from('profiles').select('current_streak, longest_streak, total_points').eq('wallet_address', walletLower).single(),
  ])

  const achievements = getAchievements({
    watchCount: watchCount ?? 0,
    quizCount: quizCount ?? 0,
    referralCount: referralCount ?? 0,
    swapCount: swapCount ?? 0,
    currentStreak: profile?.current_streak ?? 0,
    longestStreak: profile?.longest_streak ?? 0,
    totalPoints: profile?.total_points ?? 0,
  })

  return apiOk({ achievements })
}
