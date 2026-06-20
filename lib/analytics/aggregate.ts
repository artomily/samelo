import { createClient } from '@supabase/supabase-js'
import { startOfDay, endOfDay } from '@/lib/utils/date'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export interface DailyMetrics {
  date: string
  pageViews: number
  uniqueWallets: number
  videoPlays: number
  videoCompletions: number
  swaps: number
}

export async function getDailyMetrics(date = new Date()): Promise<DailyMetrics> {
  const supabase = getSupabase()
  const start = startOfDay(date).toISOString()
  const end = endOfDay(date).toISOString()

  const [pageViewsRes, videoPlaysRes, swapsRes] = await Promise.all([
    supabase
      .from('page_views')
      .select('wallet', { count: 'exact' })
      .gte('created_at', start)
      .lte('created_at', end),
    supabase
      .from('analytics_events')
      .select('wallet', { count: 'exact' })
      .eq('event', 'video_play')
      .gte('created_at', start)
      .lte('created_at', end),
    supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event', 'swap')
      .gte('created_at', start)
      .lte('created_at', end),
  ])

  const wallets = new Set([
    ...(pageViewsRes.data?.map(r => r.wallet).filter(Boolean) ?? []),
    ...(videoPlaysRes.data?.map(r => r.wallet).filter(Boolean) ?? []),
  ])

  const videoCompletionsRes = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('event', 'video_complete')
    .gte('created_at', start)
    .lte('created_at', end)

  return {
    date: date.toISOString().split('T')[0],
    pageViews: pageViewsRes.count ?? 0,
    uniqueWallets: wallets.size,
    videoPlays: videoPlaysRes.count ?? 0,
    videoCompletions: videoCompletionsRes.count ?? 0,
    swaps: swapsRes.count ?? 0,
  }
}

export async function getTopVideos(limit = 10): Promise<{ videoId: string; plays: number }[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('analytics_events')
    .select('properties')
    .eq('event', 'video_play')
    .limit(1000)

  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    const videoId = (row.properties as Record<string, string>)?.videoId
    if (videoId) counts[videoId] = (counts[videoId] ?? 0) + 1
  }

  return Object.entries(counts)
    .map(([videoId, plays]) => ({ videoId, plays }))
    .sort((a, b) => b.plays - a.plays)
    .slice(0, limit)
}
