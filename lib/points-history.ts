import { createClient } from '@supabase/supabase-js'
import type { PointsHistoryEntry, PointsSource } from './types/points-history'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getPointsHistory(
  wallet: string,
  limit = 50,
  source?: PointsSource
): Promise<PointsHistoryEntry[]> {
  const supabase = getSupabase()
  let q = supabase
    .from('points_history')
    .select('*')
    .eq('wallet', wallet)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (source) q = q.eq('source', source)
  const { data, error } = await q
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function recordPointsDelta(
  wallet: string,
  delta: number,
  source: PointsSource,
  balanceAfter: number,
  description?: string,
  referenceId?: string
): Promise<PointsHistoryEntry> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('points_history')
    .insert({
      wallet,
      delta,
      source,
      balance_after: balanceAfter,
      description: description ?? null,
      reference_id: referenceId ?? null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getPointsTotals(wallet: string): Promise<Record<PointsSource, number>> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('points_history')
    .select('source, delta')
    .eq('wallet', wallet)
    .gt('delta', 0)

  const totals = {} as Record<PointsSource, number>
  for (const row of data ?? []) {
    totals[row.source as PointsSource] = (totals[row.source as PointsSource] ?? 0) + row.delta
  }
  return totals
}
