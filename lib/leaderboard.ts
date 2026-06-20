import { createClient } from '@supabase/supabase-js'
import type { LeaderboardEntry, LeaderboardPeriod, LeaderboardSnapshot } from './types/leaderboard'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getLeaderboard(
  period: LeaderboardPeriod,
  limit = 50
): Promise<LeaderboardEntry[]> {
  const supabase = getSupabase()

  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('leaderboard_snapshots')
    .select('rank, wallet, points, snapshot_date')
    .eq('period', period)
    .eq('snapshot_date', today)
    .order('rank')
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export async function getWalletRank(
  wallet: string,
  period: LeaderboardPeriod
): Promise<LeaderboardSnapshot | null> {
  const supabase = getSupabase()
  const today = new Date().toISOString().slice(0, 10)

  const { data } = await supabase
    .from('leaderboard_snapshots')
    .select('*')
    .eq('wallet', wallet.toLowerCase())
    .eq('period', period)
    .eq('snapshot_date', today)
    .maybeSingle()

  return data ?? null
}

export async function upsertSnapshot(
  wallet: string,
  period: LeaderboardPeriod,
  points: number,
  rank: number
): Promise<void> {
  const supabase = getSupabase()
  const today = new Date().toISOString().slice(0, 10)

  const { error } = await supabase.from('leaderboard_snapshots').upsert({
    wallet: wallet.toLowerCase(),
    period,
    points,
    rank,
    snapshot_date: today,
  })
  if (error) throw error
}

export async function computeAndSnapshotLeaderboard(
  period: LeaderboardPeriod
): Promise<void> {
  const supabase = getSupabase()

  let since: string | undefined
  if (period === 'daily') {
    since = new Date().toISOString().slice(0, 10) + 'T00:00:00Z'
  } else if (period === 'weekly') {
    const d = new Date()
    d.setDate(d.getDate() - 7)
    since = d.toISOString()
  }

  let query = supabase
    .from('points_transactions')
    .select('wallet, points')

  if (since) query = query.gte('created_at', since)

  const { data, error } = await query
  if (error) throw error

  const totals: Record<string, number> = {}
  for (const row of data ?? []) {
    totals[row.wallet] = (totals[row.wallet] ?? 0) + row.points
  }

  const sorted = Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 100)

  await Promise.all(
    sorted.map(([wallet, points], i) =>
      upsertSnapshot(wallet, period, points, i + 1)
    )
  )
}
