import { createClient } from '@supabase/supabase-js'
import type { VideoRating, VideoRatingStats } from './types/video-ratings'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getRatingStats(videoId: string): Promise<VideoRatingStats | null> {
  const supabase = getSupabase()
  const { data } = await supabase.from('video_rating_stats').select('*').eq('video_id', videoId).single()
  return data ?? null
}

export async function getWalletRating(videoId: string, wallet: string): Promise<VideoRating | null> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('video_ratings')
    .select('*')
    .eq('video_id', videoId)
    .eq('wallet', wallet)
    .single()
  return data ?? null
}

export async function submitRating(
  wallet: string,
  videoId: string,
  rating: number,
  review?: string,
  watchPct?: number
): Promise<VideoRating> {
  const supabase = getSupabase()
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('video_ratings')
    .upsert(
      { wallet, video_id: videoId, rating, review: review ?? null, watch_pct_at_rating: watchPct ?? null, updated_at: now },
      { onConflict: 'wallet,video_id' }
    )
    .select()
    .single()
  if (error) throw new Error(error.message)

  await refreshRatingStats(videoId)
  return data
}

export async function refreshRatingStats(videoId: string): Promise<void> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('video_ratings')
    .select('rating')
    .eq('video_id', videoId)

  if (!data) return
  const count = data.length
  const sum = data.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0)
  const avg = count > 0 ? parseFloat((sum / count).toFixed(2)) : 0

  await supabase
    .from('video_rating_stats')
    .upsert({ video_id: videoId, rating_count: count, rating_sum: sum, avg_rating: avg, updated_at: new Date().toISOString() })
}

export async function getVideoReviews(videoId: string, limit = 20): Promise<VideoRating[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('video_ratings')
    .select('*')
    .eq('video_id', videoId)
    .not('review', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}
