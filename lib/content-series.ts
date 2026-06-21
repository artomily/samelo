import { createClient } from '@supabase/supabase-js'
import type { ContentSeries, SeriesEpisode, SeriesWithEpisodes } from './types/content-series'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getPublicSeries(limit = 20): Promise<ContentSeries[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('content_series')
    .select('*')
    .eq('is_public', true)
    .order('updated_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function getCreatorSeries(wallet: string): Promise<ContentSeries[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('content_series')
    .select('*')
    .eq('creator_wallet', wallet)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getSeriesWithEpisodes(id: string): Promise<SeriesWithEpisodes | null> {
  const supabase = getSupabase()
  const { data: series } = await supabase
    .from('content_series')
    .select('*')
    .eq('id', id)
    .single()

  if (!series) return null

  const { data: episodes } = await supabase
    .from('series_episodes')
    .select('*')
    .eq('series_id', id)
    .order('episode_number')

  return { ...series, episodes: episodes ?? [] }
}

export async function createSeries(
  creatorWallet: string,
  title: string,
  opts: { description?: string; coverUrl?: string; isPublic?: boolean } = {}
): Promise<ContentSeries> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('content_series')
    .insert({
      creator_wallet: creatorWallet,
      title,
      description: opts.description ?? null,
      cover_url: opts.coverUrl ?? null,
      is_public: opts.isPublic ?? true,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function addEpisode(
  seriesId: string,
  videoId: string,
  episodeNumber: number,
  titleOverride?: string
): Promise<SeriesEpisode> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('series_episodes')
    .insert({ series_id: seriesId, video_id: videoId, episode_number: episodeNumber, title_override: titleOverride ?? null })
    .select()
    .single()
  if (error) throw new Error(error.message)

  await supabase
    .from('content_series')
    .update({ episode_count: episodeNumber, updated_at: new Date().toISOString() })
    .eq('id', seriesId)

  return data
}

export async function removeEpisode(seriesId: string, videoId: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('series_episodes')
    .delete()
    .eq('series_id', seriesId)
    .eq('video_id', videoId)
}
