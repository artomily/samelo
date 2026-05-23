import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export const revalidate = 60 // re-fetch at most once per minute

export async function GET() {
  try {
    const supabase = getServiceSupabase()

    const { data, error } = await supabase
      .from('videos')
      .select('id, title, thumbnail_url, channel_title, duration_seconds, reward_cents')
      .eq('active', true)
      .order('fetched_at', { ascending: false })
      .limit(50)

    if (error) throw error

    // Map Supabase columns → Video shape used throughout the app
    const videos = (data ?? []).map((v) => ({
      id: v.id,
      title: v.title,
      sponsor: v.channel_title ?? 'YouTube',
      thumbnailUrl: v.thumbnail_url ?? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
      // youtube.com required for IFrame JS API (enablejsapi=1)
      videoUrl: `https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1`,
      durationSeconds: v.duration_seconds,
      rewardPoints: v.reward_cents,
    }))

    return NextResponse.json({ videos })
  } catch (err) {
    console.error('[/api/videos]', err)
    return NextResponse.json({ videos: [] }, { status: 500 })
  }
}
