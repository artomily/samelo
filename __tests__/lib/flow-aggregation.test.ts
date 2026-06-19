import { describe, it, expect } from 'vitest'

// Logic from /api/onchain/flow — day bucketing
function bucketByDay<T extends { date: string; value: number }>(
  rows: T[],
): Map<string, number> {
  const map = new Map<string, number>()
  for (const row of rows) {
    const day = row.date.slice(0, 10)
    map.set(day, (map.get(day) ?? 0) + row.value)
  }
  return map
}

describe('bucketByDay', () => {
  it('groups rows with same date prefix', () => {
    const rows = [
      { date: '2026-06-19T10:00:00Z', value: 10 },
      { date: '2026-06-19T14:00:00Z', value: 5 },
      { date: '2026-06-20T08:00:00Z', value: 7 },
    ]
    const result = bucketByDay(rows)
    expect(result.get('2026-06-19')).toBe(15)
    expect(result.get('2026-06-20')).toBe(7)
  })

  it('returns empty map for no rows', () => {
    expect(bucketByDay([]).size).toBe(0)
  })

  it('handles single row', () => {
    const result = bucketByDay([{ date: '2026-06-19T00:00:00Z', value: 42 }])
    expect(result.get('2026-06-19')).toBe(42)
  })

  it('accumulates multiple values for same day', () => {
    const rows = Array.from({ length: 5 }, () => ({ date: '2026-06-19T00:00:00Z', value: 100 }))
    expect(bucketByDay(rows).get('2026-06-19')).toBe(500)
  })
})
