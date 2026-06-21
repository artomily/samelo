import { createClient } from '@supabase/supabase-js'
import type { RevenueSplit, RevenueDistribution, RevenueSource } from './types/revenue-sharing'
import { splitRevenue, DEFAULT_SPLIT } from './types/revenue-sharing'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getRevenueSplit(videoId: string): Promise<RevenueSplit | null> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('revenue_splits')
    .select('*')
    .eq('video_id', videoId)
    .single()
  return data ?? null
}

export async function upsertRevenueSplit(
  videoId: string,
  creatorWallet: string,
  opts: { creatorPct?: number; platformPct?: number; collabWallet?: string; collabPct?: number } = {}
): Promise<RevenueSplit> {
  const supabase = getSupabase()
  const collabPct = opts.collabPct ?? 0
  const creatorPct = opts.creatorPct ?? (100 - 20 - collabPct)
  const platformPct = 100 - creatorPct - collabPct

  const { data, error } = await supabase
    .from('revenue_splits')
    .upsert({
      video_id: videoId,
      creator_wallet: creatorWallet,
      creator_pct: creatorPct,
      platform_pct: platformPct,
      collab_wallet: opts.collabWallet ?? null,
      collab_pct: collabPct,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'video_id' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function distributeRevenue(
  videoId: string,
  grossMelo: number,
  source: RevenueSource
): Promise<RevenueDistribution> {
  const supabase = getSupabase()
  const split = await getRevenueSplit(videoId) ?? { ...DEFAULT_SPLIT }
  const { creator, platform, collab } = splitRevenue(grossMelo, split)

  const { data, error } = await supabase
    .from('revenue_distributions')
    .insert({
      video_id: videoId,
      gross_melo: grossMelo,
      creator_melo: creator,
      platform_melo: platform,
      collab_melo: collab,
      source,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getVideoRevenue(videoId: string): Promise<RevenueDistribution[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('revenue_distributions')
    .select('*')
    .eq('video_id', videoId)
    .order('distributed_at', { ascending: false })
  return data ?? []
}

export async function getCreatorTotalRevenue(creatorWallet: string): Promise<number> {
  const supabase = getSupabase()
  const { data: splits } = await supabase
    .from('revenue_splits')
    .select('video_id')
    .eq('creator_wallet', creatorWallet)

  if (!splits?.length) return 0

  const videoIds = splits.map((s) => s.video_id)
  const { data } = await supabase
    .from('revenue_distributions')
    .select('creator_melo')
    .in('video_id', videoIds)

  return (data ?? []).reduce((sum, r) => sum + r.creator_melo, 0)
}
