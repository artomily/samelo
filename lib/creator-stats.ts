import { createClient } from '@supabase/supabase-js'
import type { CreatorStatsSnapshot, CreatorDashboardStats } from './types/creator'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getCreatorStats(wallet: string, days = 30): Promise<CreatorDashboardStats> {
  const supabase = getSupabase()
  const since = new Date(Date.now() - days * 86400_000).toISOString().split('T')[0]
  const { data } = await supabase
    .from('creator_stats_snapshots')
    .select('*')
    .eq('wallet', wallet)
    .gte('date', since)
    .order('date', { ascending: true })

  const snapshots: CreatorStatsSnapshot[] = data ?? []
  const totals = snapshots.reduce(
    (acc, s) => ({
      views: acc.views + s.total_views,
      watchTimeSeconds: acc.watchTimeSeconds + s.total_watch_time_seconds,
      pointsDistributed: acc.pointsDistributed + s.total_points_distributed,
      followerGrowth: acc.followerGrowth + s.new_followers,
    }),
    { views: 0, watchTimeSeconds: 0, pointsDistributed: 0, followerGrowth: 0 }
  )

  return { last30Days: snapshots, totals }
}

export async function upsertCreatorStatsSnapshot(
  wallet: string,
  date: string,
  stats: Omit<CreatorStatsSnapshot, 'id' | 'wallet' | 'date' | 'created_at'>
): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('creator_stats_snapshots').upsert({
    wallet,
    date,
    ...stats,
  })
}
