import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export interface SearchResult {
  type: 'video' | 'playlist' | 'profile'
  id: string
  title: string
  subtitle?: string
  thumbnailUrl?: string
  score?: number
}

export async function searchVideos(q: string, limit = 10): Promise<SearchResult[]> {
  const supabase = getSupabase()
  const escaped = q.replace(/[%_\\]/g, c => `\\${c}`)
  const { data } = await supabase
    .from('videos')
    .select('id, title, category, thumbnail_url')
    .ilike('title', `%${escaped}%`)
    .limit(limit)

  return (data ?? []).map(v => ({
    type: 'video' as const,
    id: v.id,
    title: v.title,
    subtitle: v.category,
    thumbnailUrl: v.thumbnail_url,
  }))
}

export async function searchPlaylists(q: string, limit = 10): Promise<SearchResult[]> {
  const supabase = getSupabase()
  const escaped = q.replace(/[%_\\]/g, c => `\\${c}`)
  const { data } = await supabase
    .from('playlists')
    .select('id, title, slug, description')
    .ilike('title', `%${escaped}%`)
    .limit(limit)

  return (data ?? []).map(p => ({
    type: 'playlist' as const,
    id: p.slug ?? p.id,
    title: p.title,
    subtitle: p.description,
  }))
}

export async function searchProfiles(q: string, limit = 10): Promise<SearchResult[]> {
  const supabase = getSupabase()
  const escaped = q.replace(/[%_\\]/g, c => `\\${c}`)
  const { data } = await supabase
    .from('profiles')
    .select('wallet_address, username, display_name, avatar_url')
    .or(`username.ilike.%${escaped}%,display_name.ilike.%${escaped}%`)
    .limit(limit)

  return (data ?? []).map(p => ({
    type: 'profile' as const,
    id: p.wallet_address,
    title: p.display_name ?? p.username ?? p.wallet_address,
    subtitle: p.username ? `@${p.username}` : undefined,
    thumbnailUrl: p.avatar_url,
  }))
}

export async function globalSearch(q: string): Promise<{ results: SearchResult[]; total: number }> {
  const [videos, playlists, profiles] = await Promise.all([
    searchVideos(q, 5),
    searchPlaylists(q, 3),
    searchProfiles(q, 3),
  ])
  const results = [...videos, ...playlists, ...profiles]
  return { results, total: results.length }
}
