import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'
import type { VideoCategory, VideoDifficulty } from '@/lib/types/video'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') as VideoCategory | null
  const difficulty = searchParams.get('difficulty') as VideoDifficulty | null
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)

  const supabase = getServiceSupabase()
  let query = supabase
    .from('videos')
    .select('id, title, youtube_id, reward_cents, category, difficulty, tags, thumbnail_url, watch_count, is_featured, duration_seconds')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('watch_count', { ascending: false })
    .limit(limit)

  if (category) query = query.eq('category', category)
  if (difficulty) query = query.eq('difficulty', difficulty)

  const { data, error } = await query
  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ videos: data ?? [], category, difficulty })
}
