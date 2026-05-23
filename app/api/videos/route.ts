import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { MOCK_VIDEOS } from '@/lib/mock-videos'

export const revalidate = 60 // re-fetch at most once per minute

export async function GET() {
  try {
    const supabase = getServiceSupabase()

    const { data, error } = await supabase
      .from('videos')
      .select('id, title, description, thumbnail_url, channel_title, duration_seconds, reward_cents')
      .eq('active', true)
      .order('fetched_at', { ascending: false })
      .limit(50)

    if (error) throw error

    // If no videos yet (playlist not configured), fall back to mock data
    if (!data || data.length === 0) {
      return NextResponse.json({ videos: MOCK_VIDEOS, source: 'mock' })
    }

    // Map Supabase columns → Video shape used throughout the app
    const videos = data.map((v) => ({
      id: v.id,
      title: v.title,
      sponsor: v.channel_title ?? 'YouTube',
      thumbnailUrl: v.thumbnail_url ?? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
      // YouTube privacy-enhanced embed URL
      videoUrl: `https://www.youtube-nocookie.com/embed/${v.id}?rel=0&modestbranding=1`,
      durationSeconds: v.duration_seconds,
      rewardPoints: v.reward_cents,
    }))

    return NextResponse.json({ videos, source: 'supabase' })
  } catch (err) {
    console.error('[/api/videos]', err)
    // Always return something — fall back to mock on any error
    return NextResponse.json({ videos: MOCK_VIDEOS, source: 'mock' })
  }
}
