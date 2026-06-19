import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 })
  }

  const supabase = getServiceSupabase()

  const { data, error } = await supabase
    .from('videos')
    .select('id, title, thumbnail_url, channel_title, duration_seconds, reward_cents')
    .eq('active', true)
    .ilike('title', `%${q}%`)
    .order('fetched_at', { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ videos: [] }, { status: 500 })
  }

  const videos = (data ?? []).map((v) => ({
    id: v.id,
    title: v.title,
    sponsor: v.channel_title ?? 'YouTube',
    thumbnailUrl: v.thumbnail_url ?? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
    videoUrl: `https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1`,
    durationSeconds: v.duration_seconds,
    rewardPoints: v.reward_cents,
  }))

  return NextResponse.json({ videos, query: q })
}
