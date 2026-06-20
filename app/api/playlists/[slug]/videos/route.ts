import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = getServiceSupabase()

  const { data: playlist } = await supabase
    .from('playlists')
    .select('id')
    .eq('slug', params.slug)
    .single()

  if (!playlist) return apiError('NOT_FOUND', 'Playlist not found', 404)

  const { data, error } = await supabase
    .from('playlist_videos')
    .select('position, videos(id, title, youtube_id, reward_cents, thumbnail_url, category, difficulty)')
    .eq('playlist_id', playlist.id)
    .order('position', { ascending: true })

  if (error) return apiError('DB_ERROR', error.message, 500)

  const videos = (data ?? []).map(row => ({ ...row.videos, position: row.position }))
  return apiOk({ videos })
}
