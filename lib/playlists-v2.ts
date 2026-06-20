import { createClient } from '@supabase/supabase-js'
import type { PlaylistV2 } from './types/playlist-v2'
import { validatePlaylistTags, MAX_PLAYLIST_TITLE_LENGTH, MAX_PLAYLIST_DESCRIPTION_LENGTH } from './types/playlist-v2'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getPublishedPlaylists(limit = 20, featured?: boolean): Promise<PlaylistV2[]> {
  const supabase = getSupabase()
  let query = supabase
    .from('playlists')
    .select('*')
    .eq('published', true)
    .order('view_count', { ascending: false })
    .limit(limit)

  if (featured !== undefined) query = query.eq('featured', featured)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getPlaylistsByTag(tag: string, limit = 20): Promise<PlaylistV2[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('published', true)
    .contains('tags', [tag.toLowerCase()])
    .order('view_count', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function likePlaylist(wallet: string, playlistId: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('playlist_likes').upsert({
    wallet: wallet.toLowerCase(),
    playlist_id: playlistId,
  })
}

export async function unlikePlaylist(wallet: string, playlistId: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('playlist_likes')
    .delete()
    .eq('wallet', wallet.toLowerCase())
    .eq('playlist_id', playlistId)
}

export async function isPlaylistLiked(wallet: string, playlistId: string): Promise<boolean> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('playlist_likes')
    .select('wallet')
    .eq('wallet', wallet.toLowerCase())
    .eq('playlist_id', playlistId)
    .maybeSingle()
  return !!data
}

export async function incrementPlaylistViews(playlistId: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.rpc('increment', { table: 'playlists', column: 'view_count', id: playlistId })
}

export async function updatePlaylistMeta(
  playlistId: string,
  wallet: string,
  updates: Partial<Pick<PlaylistV2, 'title' | 'description' | 'tags' | 'cover_url' | 'published'>>
): Promise<void> {
  const supabase = getSupabase()
  const clean: typeof updates = { ...updates }
  if (clean.title) clean.title = clean.title.slice(0, MAX_PLAYLIST_TITLE_LENGTH)
  if (clean.description) clean.description = clean.description.slice(0, MAX_PLAYLIST_DESCRIPTION_LENGTH)
  if (clean.tags) clean.tags = validatePlaylistTags(clean.tags)

  const { error } = await supabase
    .from('playlists')
    .update(clean)
    .eq('id', playlistId)
    .eq('creator_wallet', wallet.toLowerCase())
  if (error) throw error
}
