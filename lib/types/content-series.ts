export interface ContentSeries {
  id: string
  creator_wallet: string
  title: string
  description: string | null
  cover_url: string | null
  is_public: boolean
  is_complete: boolean
  episode_count: number
  created_at: string
  updated_at: string
}

export interface SeriesEpisode {
  id: string
  series_id: string
  video_id: string
  episode_number: number
  title_override: string | null
  created_at: string
}

export interface SeriesWithEpisodes extends ContentSeries {
  episodes: SeriesEpisode[]
}

export function episodeLabel(episode: SeriesEpisode): string {
  return `Ep. ${episode.episode_number}${episode.title_override ? ` — ${episode.title_override}` : ''}`
}

export function completionPct(series: ContentSeries, watchedCount: number): number {
  if (series.episode_count === 0) return 0
  return Math.min(100, Math.round((watchedCount / series.episode_count) * 100))
}

export function nextEpisode(episodes: SeriesEpisode[], watchedIds: string[]): SeriesEpisode | null {
  const watchedSet = new Set(watchedIds)
  return episodes
    .sort((a, b) => a.episode_number - b.episode_number)
    .find((e) => !watchedSet.has(e.video_id)) ?? null
}
