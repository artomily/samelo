import { describe, it, expect } from 'vitest'
import { episodeLabel, completionPct, nextEpisode } from '@/lib/types/content-series'
import type { ContentSeries, SeriesEpisode } from '@/lib/types/content-series'

function makeSeries(overrides: Partial<ContentSeries> = {}): ContentSeries {
  return {
    id: 's1',
    creator_wallet: '0xabc',
    title: 'DeFi Fundamentals',
    description: null,
    cover_url: null,
    is_public: true,
    is_complete: false,
    episode_count: 5,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function makeEp(num: number, videoId: string, titleOverride?: string): SeriesEpisode {
  return {
    id: `ep${num}`,
    series_id: 's1',
    video_id: videoId,
    episode_number: num,
    title_override: titleOverride ?? null,
    created_at: '2026-01-01T00:00:00Z',
  }
}

describe('episodeLabel', () => {
  it('returns basic label without override', () => {
    expect(episodeLabel(makeEp(1, 'v1'))).toBe('Ep. 1')
  })

  it('includes title override', () => {
    expect(episodeLabel(makeEp(2, 'v2', 'What is DeFi?'))).toBe('Ep. 2 — What is DeFi?')
  })
})

describe('completionPct', () => {
  it('returns 0 for empty series', () => {
    expect(completionPct(makeSeries({ episode_count: 0 }), 0)).toBe(0)
  })

  it('calculates completion', () => {
    expect(completionPct(makeSeries({ episode_count: 4 }), 2)).toBe(50)
  })

  it('caps at 100', () => {
    expect(completionPct(makeSeries({ episode_count: 3 }), 10)).toBe(100)
  })
})

describe('nextEpisode', () => {
  const episodes = [makeEp(1, 'v1'), makeEp(2, 'v2'), makeEp(3, 'v3')]

  it('returns first unwatched episode', () => {
    expect(nextEpisode(episodes, ['v1'])!.video_id).toBe('v2')
  })

  it('returns first episode when nothing watched', () => {
    expect(nextEpisode(episodes, [])!.video_id).toBe('v1')
  })

  it('returns null when all watched', () => {
    expect(nextEpisode(episodes, ['v1', 'v2', 'v3'])).toBeNull()
  })
})
