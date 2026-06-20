import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = getServiceSupabase()

  const { data: playlist, error } = await supabase
    .from('playlists')
    .select('id, slug, title, description, thumbnail_url, is_featured, created_at')
    .eq('slug', params.slug)
    .single()

  if (error || !playlist) return apiError('NOT_FOUND', 'Playlist not found', 404)

  const { data: videos } = await supabase
    .from('playlist_videos')
    .select('position, video_id, videos(id, title, youtube_id, reward_cents, thumbnail_url)')
    .eq('playlist_id', playlist.id)
    .order('position', { ascending: true })

  return apiOk({ playlist: { ...playlist, videos: (videos ?? []).map(v => ({ ...v.videos, position: v.position })) } })
}
