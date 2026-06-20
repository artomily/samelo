import { createClient } from '@supabase/supabase-js'
import { parseSearchQuery, buildFtsQuery } from './types/search-v2'
import type { SearchResultV2, SearchFilters } from './types/search-v2'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function searchVideos(
  query: string,
  filters: SearchFilters = {}
): Promise<SearchResultV2[]> {
  const supabase = getSupabase()
  const { terms } = parseSearchQuery(query)
  if (!terms.length) return []
  const ftsQuery = buildFtsQuery(terms)

  let q = supabase
    .from('search_index_videos')
    .select('video_id, title, description, view_count')
    .textSearch('title', ftsQuery, { type: 'websearch' })

  if (filters.minViews) {
    q = q.gte('view_count', filters.minViews)
  }

  const { data, error } = await q.limit(20)
  if (error) return []
  return (data ?? []).map((row, i) => ({
    id: row.video_id,
    type: 'video',
    title: row.title,
    subtitle: row.description?.slice(0, 80) ?? null,
    thumbnail_url: null,
    relevance: 1 - i * 0.01,
  }))
}

export async function recordSearch(wallet: string, query: string, resultCount: number): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('search_history').insert({ wallet, query, result_count: resultCount })
}

export async function getSearchHistory(wallet: string, limit = 10): Promise<string[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('search_history')
    .select('query')
    .eq('wallet', wallet)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []).map((r) => r.query)
}

export async function upsertVideoIndex(
  videoId: string,
  title: string,
  description: string | null,
  tags: string[],
  creatorWallet: string | null,
  viewCount: number
): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('search_index_videos').upsert({
    video_id: videoId,
    title,
    description,
    tags,
    creator_wallet: creatorWallet,
    view_count: viewCount,
    updated_at: new Date().toISOString(),
  })
}
