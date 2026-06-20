import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAdminWallet } from '@/lib/admin-auth'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const wallet = request.headers.get('x-wallet-address')
  if (!wallet || !isAdminWallet(wallet)) return apiError('UNAUTHORIZED', 'Admin only', 403)

  const supabase = getServiceSupabase()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { count: totalUsers },
    { count: totalWatches },
    { count: totalSwaps },
    { count: totalReferrals },
    { data: pointsData },
    { data: burnData },
    { data: meloData },
    { count: activeUsers7d },
    { count: newUsers7d },
    { count: watches7d },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('watches').select('*', { count: 'exact', head: true }),
    supabase.from('point_swaps').select('*', { count: 'exact', head: true }),
    supabase.from('referrals').select('*', { count: 'exact', head: true }),
    supabase.from('watches').select('reward_cents'),
    supabase.from('point_swaps').select('points_burned'),
    supabase.from('point_swaps').select('melo_received'),
    supabase.from('watches').select('wallet_address', { count: 'exact', head: true }).gte('watched_at', sevenDaysAgo),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
    supabase.from('watches').select('*', { count: 'exact', head: true }).gte('watched_at', sevenDaysAgo),
  ])

  const totalPointsIssued = (pointsData ?? []).reduce((s, r) => s + (r.reward_cents ?? 0), 0)
  const totalPointsBurned = (burnData ?? []).reduce((s, r) => s + (r.points_burned ?? 0), 0)
  const totalMeloMinted = (meloData ?? []).reduce((s, r) => s + parseFloat(r.melo_received ?? '0'), 0)

  return apiOk({
    totalUsers: totalUsers ?? 0,
    totalWatches: totalWatches ?? 0,
    totalPointsIssued,
    totalPointsBurned,
    totalMeloMinted,
    totalSwaps: totalSwaps ?? 0,
    totalReferrals: totalReferrals ?? 0,
    activeUsersLast7Days: activeUsers7d ?? 0,
    newUsersLast7Days: newUsers7d ?? 0,
    watchesLast7Days: watches7d ?? 0,
  })
}
