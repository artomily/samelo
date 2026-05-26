import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get('walletAddress')

  try {
    const supabase = getServiceSupabase()

    // Fetch all videos that have quizzes
    const { data: quizVideos } = await supabase
      .from('video_quizzes')
      .select('video_id, summary')

    const quizVideoIds = new Set((quizVideos ?? []).map((q) => q.video_id))
    const quizSummaries = new Map((quizVideos ?? []).map((q) => [q.video_id, q.summary]))

    // Get video details
    const { data: videos } = await supabase
      .from('videos')
      .select('id, title, thumbnail_url, channel_title, duration_seconds, reward_cents')
      .eq('active', true)
      .order('fetched_at', { ascending: false })
      .limit(50)

    const videoList = (videos ?? []).map((v) => ({
      id: v.id,
      title: v.title,
      thumbnailUrl: v.thumbnail_url,
      channelTitle: v.channel_title,
      durationSeconds: v.duration_seconds,
      rewardPoints: v.reward_cents,
      hasQuiz: quizVideoIds.has(v.id),
      quizSummary: quizSummaries.get(v.id) ?? null,
    }))

    // If wallet provided, get user's quiz attempts
    let quizAttemptedIds = new Set<string>()
    let watchIds = new Set<string>()

    if (wallet && /^0x[0-9a-fA-F]{40}$/.test(wallet)) {
      const w = wallet.toLowerCase()

      const { data: attempts } = await supabase
        .from('user_quiz_attempts')
        .select('video_id')
        .eq('wallet_address', w)

      quizAttemptedIds = new Set((attempts ?? []).map((a) => a.video_id))

      const { data: watches } = await supabase
        .from('watches')
        .select('video_id')
        .eq('wallet_address', w)

      watchIds = new Set((watches ?? []).map((w) => w.video_id))
    }

    return NextResponse.json({
      missions: videoList.map((v) => ({
        ...v,
        watched: watchIds.has(v.id),
        quizCompleted: quizAttemptedIds.has(v.id),
      })),
    })
  } catch (err) {
    console.error('[/api/missions]', err)
    return NextResponse.json({ error: 'Failed to fetch missions' }, { status: 500 })
  }
}
