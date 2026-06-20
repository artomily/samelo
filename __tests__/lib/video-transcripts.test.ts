import { describe, it, expect } from 'vitest'
import {
  STATUS_LABELS,
  SOURCE_LABELS,
  isReady,
  formatMs,
  searchSegments,
} from '@/lib/types/video-transcripts'
import type { VideoTranscript, TranscriptSegment } from '@/lib/types/video-transcripts'

function makeTranscript(overrides: Partial<VideoTranscript> = {}): VideoTranscript {
  return {
    id: 'tid',
    video_id: 'vid',
    language: 'en',
    source: 'manual',
    status: 'ready',
    full_text: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function makeSeg(overrides: Partial<TranscriptSegment> = {}): TranscriptSegment {
  return {
    id: 's1',
    transcript_id: 'tid',
    start_ms: 0,
    end_ms: 3000,
    text: 'hello world',
    confidence: 0.95,
    segment_index: 0,
    ...overrides,
  }
}

describe('STATUS_LABELS', () => {
  it('maps all statuses', () => {
    expect(STATUS_LABELS.ready).toBe('Ready')
    expect(STATUS_LABELS.failed).toBe('Failed')
    expect(STATUS_LABELS.pending).toBe('Pending')
    expect(STATUS_LABELS.processing).toBe('Processing')
  })
})

describe('SOURCE_LABELS', () => {
  it('maps auto to Auto-generated', () => {
    expect(SOURCE_LABELS.auto).toBe('Auto-generated')
  })
})

describe('isReady', () => {
  it('returns true for ready transcripts', () => {
    expect(isReady(makeTranscript({ status: 'ready' }))).toBe(true)
  })

  it('returns false for non-ready transcripts', () => {
    expect(isReady(makeTranscript({ status: 'processing' }))).toBe(false)
  })
})

describe('formatMs', () => {
  it('formats seconds without hours', () => {
    expect(formatMs(65_000)).toBe('1:05')
  })

  it('formats with hours', () => {
    expect(formatMs(3_661_000)).toBe('1:01:01')
  })

  it('formats zero as 0:00', () => {
    expect(formatMs(0)).toBe('0:00')
  })
})

describe('searchSegments', () => {
  const segs = [
    makeSeg({ id: 's1', text: 'hello world', segment_index: 0 }),
    makeSeg({ id: 's2', text: 'goodbye earth', segment_index: 1 }),
  ]

  it('returns matching segments', () => {
    expect(searchSegments(segs, 'hello')).toHaveLength(1)
  })

  it('is case-insensitive', () => {
    expect(searchSegments(segs, 'HELLO')).toHaveLength(1)
  })

  it('returns empty for blank query', () => {
    expect(searchSegments(segs, '')).toHaveLength(0)
  })

  it('returns all matches when multiple segments match', () => {
    expect(searchSegments(segs, 'o')).toHaveLength(2)
  })
})
