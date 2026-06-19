import { describe, it, expect } from 'vitest'

// Logic extracted from /api/videos/trending
function rankByWatchCount(
  watchRows: { video_id: string }[],
  limit = 10,
): string[] {
  const counts = new Map<string, number>()
  for (const row of watchRows) {
    counts.set(row.video_id, (counts.get(row.video_id) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id)
}

describe('rankByWatchCount', () => {
  it('returns most-watched video first', () => {
    const rows = [
      { video_id: 'A' }, { video_id: 'B' }, { video_id: 'A' }, { video_id: 'A' },
    ]
    expect(rankByWatchCount(rows)[0]).toBe('A')
  })

  it('limits to top N results', () => {
    const rows = Array.from({ length: 20 }, (_, i) => ({ video_id: `v${i}` }))
    expect(rankByWatchCount(rows, 5)).toHaveLength(5)
  })

  it('returns empty array for no watches', () => {
    expect(rankByWatchCount([])).toHaveLength(0)
  })

  it('handles tie correctly — both appear in results', () => {
    const rows = [{ video_id: 'A' }, { video_id: 'B' }]
    const result = rankByWatchCount(rows)
    expect(result).toContain('A')
    expect(result).toContain('B')
  })
})
