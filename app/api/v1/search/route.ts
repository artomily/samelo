import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) return apiError('VALIDATION', 'q must be at least 2 characters', 400)
  if (q.length > 100) return apiError('VALIDATION', 'q too long', 400)

  const supabase = getServiceSupabase()
  const term = `%${q.replace(/[%_\\]/g, ch => `\\${ch}`)}%`

  const [videos, profiles] = await Promise.all([
    supabase
      .from('videos')
      .select('id, title, thumbnail_url, category, difficulty')
      .ilike('title', term)
      .eq('is_active', true)
      .limit(5),
    supabase
      .from('profiles')
      .select('wallet, display_name, avatar_url')
      .ilike('display_name', term)
      .limit(5),
  ])

  return apiOk({
    videos: videos.data ?? [],
    profiles: profiles.data ?? [],
    query: q,
  })
}
