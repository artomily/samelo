import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category')
  const difficulty = request.nextUrl.searchParams.get('difficulty')
  const featured = request.nextUrl.searchParams.get('featured') === 'true'
  const limit = Math.min(50, parseInt(request.nextUrl.searchParams.get('limit') ?? '20'))
  const offset = parseInt(request.nextUrl.searchParams.get('offset') ?? '0')

  const supabase = getServiceSupabase()
  let query = supabase
    .from('videos')
    .select('id, title, youtube_id, thumbnail_url, category, difficulty, reward_cents, is_featured, watch_count', { count: 'exact' })
    .eq('is_active', true)

  if (category) query = query.eq('category', category)
  if (difficulty) query = query.eq('difficulty', difficulty)
  if (featured) query = query.eq('is_featured', true)

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return apiError('DB_ERROR', error.message, 500)
  return apiOk({ videos: data ?? [], total: count ?? 0, limit, offset })
}
