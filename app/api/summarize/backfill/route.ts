import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

function buildDummySummary(title: string): { summary: string; key_points: string[] } {
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

/**
 * GET /api/summarize/backfill
 *
 * Generates dummy summaries for ALL videos and inserts into video_summaries.
 * Skips videos that already have a summary.
 */
export async function GET() {
  try {
    const supabase = getServiceSupabase()

    const { data: videos, error: vidErr } = await supabase
      .from('videos')
      .select('id, title')

    if (vidErr) throw vidErr
    if (!videos || videos.length === 0) {
      return NextResponse.json({ message: 'No videos found' })
    }

    let inserted = 0
    let skipped = 0

    for (const v of videos) {
      const { data: existing } = await supabase
        .from('video_summaries')
        .select('video_id')
        .eq('video_id', v.id)
        .maybeSingle()

      if (existing) {
        skipped++
        continue
      }

      const { summary, key_points } = buildDummySummary(v.title ?? '')

      const { error: insertErr } = await supabase
        .from('video_summaries')
        .upsert({
          video_id: v.id,
          summary,
          key_points: JSON.stringify(key_points),
          generated_at: new Date().toISOString(),
        }, { onConflict: 'video_id', ignoreDuplicates: true })

      if (insertErr) {
        console.error(`[backfill] failed for ${v.id}:`, insertErr.message)
        continue
      }

      inserted++
    }

    return NextResponse.json({
      message: `Backfill complete`,
      total: videos.length,
      inserted,
      skipped,
    })
  } catch (err) {
    console.error('[/api/summarize/backfill]', err)
    return NextResponse.json({ error: 'Backfill failed' }, { status: 500 })
  }
}
