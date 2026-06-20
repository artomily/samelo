import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(_request: NextRequest) {
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('videos')
    .select('id, title, youtube_id, reward_cents, category, difficulty, tags, thumbnail_url, watch_count, duration_seconds')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('watch_count', { ascending: false })
    .limit(6)

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ videos: data ?? [] })
}
