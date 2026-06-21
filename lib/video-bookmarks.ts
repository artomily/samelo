import { createClient } from '@supabase/supabase-js'
import type { VideoBookmark } from './types/video-bookmarks'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function addBookmark(
  wallet: string,
  videoId: string,
  opts: { timestampMs?: number; note?: string; isPrivate?: boolean } = {}
): Promise<VideoBookmark> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('video_bookmarks')
    .insert({
      wallet,
      video_id: videoId,
      timestamp_ms: opts.timestampMs ?? null,
      note: opts.note ?? null,
      is_private: opts.isPrivate ?? true,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function removeBookmark(id: string, wallet: string): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('video_bookmarks').delete().eq('id', id).eq('wallet', wallet)
}

export async function getWalletBookmarks(wallet: string, limit = 50): Promise<VideoBookmark[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('video_bookmarks')
    .select('*')
    .eq('wallet', wallet)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function getVideoBookmarks(videoId: string, wallet?: string): Promise<VideoBookmark[]> {
  const supabase = getSupabase()
  let query = supabase
    .from('video_bookmarks')
    .select('*')
    .eq('video_id', videoId)
    .order('timestamp_ms', { ascending: true, nullsFirst: true })

  if (wallet) {
    query = query.eq('wallet', wallet)
  } else {
    query = query.eq('is_private', false)
  }

  const { data } = await query
  return data ?? []
}

export async function isBookmarked(wallet: string, videoId: string): Promise<boolean> {
  const supabase = getSupabase()
  const { count } = await supabase
    .from('video_bookmarks')
    .select('*', { count: 'exact', head: true })
    .eq('wallet', wallet)
    .eq('video_id', videoId)
  return (count ?? 0) > 0
}
