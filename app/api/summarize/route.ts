import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

function buildDummySummary(title: string, description: string): { summary: string; key_points: string[] } {
  const cleanTitle = title.replace(/[^\w\s]/g, '').trim()

  const summary = `This video covers "${cleanTitle}". It provides insights and practical knowledge on the topic, breaking down complex concepts into easy-to-follow explanations. Viewers will gain a solid understanding of the subject and learn actionable takeaways they can apply right away.`

  const keyPoints = [
    `Understand the fundamentals of ${cleanTitle}`,
    `Learn practical tips and techniques`,
    `Gain insights from real examples and demonstrations`,
    `Apply what you learn to real-world scenarios`,
  ]

  return { summary, key_points: keyPoints }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const videoId = searchParams.get('videoId')

  if (!videoId || typeof videoId !== 'string') {
    return NextResponse.json({ error: 'videoId is required' }, { status: 400 })
  }

  try {
    const supabase = getServiceSupabase()

    // 1. Check video_summaries cache
    const { data: cached, error: cacheErr } = await supabase
      .from('video_summaries')
      .select('summary, key_points, generated_at')
      .eq('video_id', videoId)
      .maybeSingle()

    if (cacheErr) throw cacheErr

    if (cached) {
      const keyPoints = typeof cached.key_points === 'string'
        ? JSON.parse(cached.key_points)
        : cached.key_points

      return NextResponse.json({
        videoId,
        summary: cached.summary,
        keyPoints,
        generatedAt: cached.generated_at,
        cached: true,
      })
    }

    // 2. Fallback to video_quizzes summary
    const { data: quiz, error: quizErr } = await supabase
      .from('video_quizzes')
      .select('summary, generated_at')
      .eq('video_id', videoId)
      .maybeSingle()

    if (quizErr) throw quizErr

    if (quiz?.summary) {
      try {
        await supabase
          .from('video_summaries')
          .upsert({
            video_id: videoId,
            summary: quiz.summary,
            key_points: JSON.stringify([]),
            generated_at: quiz.generated_at ?? new Date().toISOString(),
          }, { onConflict: 'video_id', ignoreDuplicates: false })
      } catch { /* ignore */ }

      return NextResponse.json({
        videoId,
        summary: quiz.summary,
        keyPoints: [],
        generatedAt: quiz.generated_at,
        cached: true,
      })
    }

    // 3. Generate dummy summary from video title
    const { data: video, error: videoErr } = await supabase
      .from('videos')
      .select('id, title, description')
      .eq('id', videoId)
      .maybeSingle()

    if (videoErr) throw videoErr
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    const { summary, key_points } = buildDummySummary(video.title ?? '', video.description ?? '')

    await supabase
      .from('video_summaries')
      .upsert({
        video_id: videoId,
        summary,
        key_points: JSON.stringify(key_points),
        generated_at: new Date().toISOString(),
      }, { onConflict: 'video_id', ignoreDuplicates: false })

    return NextResponse.json({
      videoId,
      summary,
      keyPoints: key_points,
      generatedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[/api/summarize]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch summary' },
      { status: 500 },
    )
  }
}
