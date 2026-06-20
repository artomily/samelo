import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const period = request.nextUrl.searchParams.get('period') ?? 'all'
  const limit = Math.min(100, parseInt(request.nextUrl.searchParams.get('limit') ?? '50'))

  if (!['all', 'weekly', 'monthly'].includes(period)) {
    return apiError('VALIDATION', 'period must be all, weekly, or monthly', 400)
  }

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('profiles')
    .select('wallet, display_name, avatar_url, total_points, level, xp')
    .gt('total_points', 0)
    .order('total_points', { ascending: false })
    .limit(limit)

  if (error) return apiError('DB_ERROR', error.message, 500)

  const leaderboard = (data ?? []).map((row, i) => ({ rank: i + 1, ...row }))
  return apiOk({ leaderboard, period, total: leaderboard.length }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
  } as any)
}
