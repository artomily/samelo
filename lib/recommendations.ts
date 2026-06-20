import { createClient } from '@supabase/supabase-js'
import { SIGNAL_WEIGHTS, isCacheStale } from './types/recommendations'
import type { RecommendationSignal, VideoTag, RecommendationCache, SignalType } from './types/recommendations'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function recordSignal(wallet: string, videoId: string, signalType: SignalType): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('recommendation_signals').insert({
    wallet,
    video_id: videoId,
    signal_type: signalType,
    signal_weight: SIGNAL_WEIGHTS[signalType],
  })
}

export async function getWalletSignals(wallet: string, limit = 50): Promise<RecommendationSignal[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('recommendation_signals')
    .select('*')
    .eq('wallet', wallet)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function getVideoTags(videoId: string): Promise<VideoTag[]> {
  const supabase = getSupabase()
  const { data } = await supabase.from('video_tags').select('*').eq('video_id', videoId)
  return data ?? []
}

export async function setVideoTags(videoId: string, tags: string[]): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('video_tags').delete().eq('video_id', videoId)
  if (tags.length === 0) return
  await supabase.from('video_tags').insert(tags.map((tag) => ({ video_id: videoId, tag })))
}

export async function getRecommendations(wallet: string): Promise<string[]> {
  const supabase = getSupabase()

  const { data: cached } = await supabase
    .from('recommendation_cache')
    .select('*')
    .eq('wallet', wallet)
    .single()

  if (cached && !isCacheStale(cached as RecommendationCache)) {
    return (cached as RecommendationCache).video_ids
  }

  const { data: signals } = await supabase
    .from('recommendation_signals')
    .select('video_id, signal_weight')
    .eq('wallet', wallet)
    .order('created_at', { ascending: false })
    .limit(100)

  if (!signals || signals.length === 0) return []

  const scoreMap = new Map<string, number>()
  for (const s of signals) {
    scoreMap.set(s.video_id, (scoreMap.get(s.video_id) ?? 0) + s.signal_weight)
  }

  const videoIds = [...scoreMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([id]) => id)

  await supabase
    .from('recommendation_cache')
    .upsert({ wallet, video_ids: videoIds, reason: 'signal-score', computed_at: new Date().toISOString() })

  return videoIds
}
