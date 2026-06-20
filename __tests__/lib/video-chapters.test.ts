import { describe, it, expect } from 'vitest'
import { formatTimestamp, chapterDuration, isChapterComplete } from '@/lib/types/video-chapters'
import type { VideoChapter, ChapterProgress } from '@/lib/types/video-chapters'

const makeChapter = (overrides: Partial<VideoChapter> = {}): VideoChapter => ({
  id: 'ch1',
  video_id: 'vid1',
  title: 'Introduction',
  start_time_seconds: 0,
  end_time_seconds: 120,
  description: null,
  thumbnail_url: null,
  has_quiz: false,
  points_reward: 10,
  sort_order: 0,
  created_at: '2026-06-21T00:00:00Z',
  ...overrides,
})

const makeProgress = (overrides: Partial<ChapterProgress> = {}): ChapterProgress => ({
  id: 'p1',
  wallet: '0x1234567890123456789012345678901234567890',
  chapter_id: 'ch1',
  completed: false,
  watch_pct: 0,
  points_awarded: false,
  completed_at: null,
  created_at: '2026-06-21T00:00:00Z',
  updated_at: '2026-06-21T00:00:00Z',
  ...overrides,
})

describe('formatTimestamp', () => {
  it('formats seconds as M:SS', () => {
    expect(formatTimestamp(65)).toBe('1:05')
  })

  it('formats hours correctly', () => {
    expect(formatTimestamp(3661)).toBe('1:01:01')
  })

  it('formats zero as 0:00', () => {
    expect(formatTimestamp(0)).toBe('0:00')
  })
})

describe('chapterDuration', () => {
  it('returns duration when end_time is set', () => {
    expect(chapterDuration(makeChapter())).toBe(120)
  })

  it('returns null when no end_time', () => {
    expect(chapterDuration(makeChapter({ end_time_seconds: null }))).toBeNull()
  })
})

describe('isChapterComplete', () => {
  it('returns false for null progress', () => {
    expect(isChapterComplete(null)).toBe(false)
  })

  it('returns true for completed progress', () => {
    expect(isChapterComplete(makeProgress({ completed: true }))).toBe(true)
  })

  it('returns false for incomplete progress', () => {
    expect(isChapterComplete(makeProgress())).toBe(false)
  })
})
