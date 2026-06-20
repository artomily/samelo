import { createClient } from '@supabase/supabase-js'
import type { VideoChapter, ChapterProgress, VideoChapterWithProgress } from './types/video-chapters'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getVideoChapters(videoId: string, wallet?: string): Promise<VideoChapterWithProgress[]> {
  const supabase = getSupabase()
  const { data: chapters } = await supabase
    .from('video_chapters')
    .select('*')
    .eq('video_id', videoId)
    .order('sort_order', { ascending: true })

  if (!chapters || chapters.length === 0) return []
  if (!wallet) return chapters.map((c) => ({ ...c, progress: null }))

  const chapterIds = chapters.map((c: VideoChapter) => c.id)
  const { data: progressRows } = await supabase
    .from('video_chapter_progress')
    .select('*')
    .eq('wallet', wallet)
    .in('chapter_id', chapterIds)

  const progressMap = new Map<string, ChapterProgress>()
  for (const p of progressRows ?? []) progressMap.set(p.chapter_id, p)

  return chapters.map((c: VideoChapter) => ({ ...c, progress: progressMap.get(c.id) ?? null }))
}

export async function upsertChapterProgress(
  wallet: string,
  chapterId: string,
  watchPct: number,
  completed: boolean
): Promise<ChapterProgress> {
  const supabase = getSupabase()
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('video_chapter_progress')
    .upsert(
      {
        wallet,
        chapter_id: chapterId,
        watch_pct: watchPct,
        completed,
        completed_at: completed ? now : null,
        updated_at: now,
      },
      { onConflict: 'wallet,chapter_id' }
    )
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function createChapter(
  videoId: string,
  title: string,
  startTimeSeconds: number,
  opts: { endTimeSeconds?: number; description?: string; pointsReward?: number; hasQuiz?: boolean; sortOrder?: number }
): Promise<VideoChapter> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('video_chapters')
    .insert({
      video_id: videoId,
      title,
      start_time_seconds: startTimeSeconds,
      end_time_seconds: opts.endTimeSeconds ?? null,
      description: opts.description ?? null,
      points_reward: opts.pointsReward ?? 0,
      has_quiz: opts.hasQuiz ?? false,
      sort_order: opts.sortOrder ?? 0,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}
