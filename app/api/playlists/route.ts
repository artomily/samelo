import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(_request: NextRequest) {
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('playlists')
    .select(`id, slug, title, description, thumbnail_url, is_featured, sort_order, created_at,
      playlist_videos(count)`)
    .order('sort_order', { ascending: true })

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ playlists: data ?? [] })
}
