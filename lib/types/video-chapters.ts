export interface VideoChapter {
  id: string
  video_id: string
  title: string
  start_time_seconds: number
  end_time_seconds: number | null
  description: string | null
  thumbnail_url: string | null
  has_quiz: boolean
  points_reward: number
  sort_order: number
  created_at: string
}

export interface ChapterProgress {
  id: string
  wallet: string
  chapter_id: string
  completed: boolean
  watch_pct: number
  points_awarded: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface VideoChapterWithProgress extends VideoChapter {
  progress: ChapterProgress | null
}

export function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function chapterDuration(chapter: VideoChapter): number | null {
  if (chapter.end_time_seconds === null) return null
  return chapter.end_time_seconds - chapter.start_time_seconds
}

export function isChapterComplete(progress: ChapterProgress | null): boolean {
  return progress?.completed ?? false
}
