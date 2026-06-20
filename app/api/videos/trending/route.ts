import { NextRequest } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { apiError, apiOk } from '@/lib/api-error'

export async function GET(_request: NextRequest) {
  const supabase = getServiceSupabase()

  // Trending = most watched in the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: watchRows, error: watchError } = await supabase
    .from('watches')
    .select('video_id')
    .gte('watched_at', sevenDaysAgo)

  if (watchError) return apiError('DB_ERROR', watchError.message, 500)

  // Count watches per video
  const counts = new Map<string, number>()
  for (const row of (watchRows ?? [])) {
    counts.set(row.video_id, (counts.get(row.video_id) ?? 0) + 1)
  }

  // Sort by recent watch count, take top 10
  const topIds = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => id)

  if (topIds.length === 0) return apiOk({ videos: [] })

  const { data, error } = await supabase
    .from('videos')
    .select('id, title, youtube_id, reward_cents, category, difficulty, thumbnail_url, watch_count')
    .in('id', topIds)
    .eq('is_active', true)

  if (error) return apiError('DB_ERROR', error.message, 500)

  const sorted = (data ?? []).sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0))
  return apiOk({ videos: sorted, period: '7d' })
}
