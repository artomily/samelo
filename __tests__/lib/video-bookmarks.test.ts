import { describe, it, expect } from 'vitest'
import {
  formatBookmarkTime,
  sortByTimestamp,
  hasNote,
} from '@/lib/types/video-bookmarks'
import type { VideoBookmark } from '@/lib/types/video-bookmarks'

function makeBookmark(overrides: Partial<VideoBookmark> = {}): VideoBookmark {
  return {
    id: 'b1',
    wallet: '0xabc',
    video_id: 'vid1',
    timestamp_ms: null,
    note: null,
    is_private: true,
    created_at: '2026-06-01T00:00:00Z',
    ...overrides,
  }
}

describe('formatBookmarkTime', () => {
  it('returns Start for null timestamp', () => {
    expect(formatBookmarkTime(null)).toBe('Start')
  })

  it('formats seconds without hours', () => {
    expect(formatBookmarkTime(90_000)).toBe('1:30')
  })

  it('formats with hours', () => {
    expect(formatBookmarkTime(3_661_000)).toBe('1:01:01')
  })

  it('formats zero as 0:00', () => {
    expect(formatBookmarkTime(0)).toBe('0:00')
  })
})

describe('sortByTimestamp', () => {
  it('sorts bookmarks by timestamp ascending', () => {
    const bookmarks = [
      makeBookmark({ id: 'b3', timestamp_ms: 30_000 }),
      makeBookmark({ id: 'b1', timestamp_ms: 0 }),
      makeBookmark({ id: 'b2', timestamp_ms: 10_000 }),
    ]
    const sorted = sortByTimestamp(bookmarks)
    expect(sorted.map((b) => b.id)).toEqual(['b1', 'b2', 'b3'])
  })

  it('treats null timestamp as 0', () => {
    const b = [
      makeBookmark({ id: 'b2', timestamp_ms: 5_000 }),
      makeBookmark({ id: 'b1', timestamp_ms: null }),
    ]
    expect(sortByTimestamp(b)[0].id).toBe('b1')
  })
})

describe('hasNote', () => {
  it('returns true when note is non-empty', () => {
    expect(hasNote(makeBookmark({ note: 'Great moment' }))).toBe(true)
  })

  it('returns false for null note', () => {
    expect(hasNote(makeBookmark({ note: null }))).toBe(false)
  })

  it('returns false for whitespace-only note', () => {
    expect(hasNote(makeBookmark({ note: '   ' }))).toBe(false)
  })
})
