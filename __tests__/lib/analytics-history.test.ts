import { describe, it, expect } from 'vitest'
import { lastNDays } from '@/lib/date-range'

// Logic extracted from /api/analytics/history
function bucketWatchesByDay(
  watches: { watched_at: string; reward_cents: number }[],
  days: number,
  base: Date,
) {
  const dates = lastNDays(days, base)
  const byDay = new Map(dates.map(d => [d, { watches: 0, points: 0 }]))
  for (const row of watches) {
    const day = row.watched_at.slice(0, 10)
    if (byDay.has(day)) {
      const entry = byDay.get(day)!
      entry.watches++
      entry.points += row.reward_cents
    }
  }
  return dates.map(date => ({ date, ...byDay.get(date)! }))
}

const BASE = new Date('2026-06-19T12:00:00Z')

describe('bucketWatchesByDay', () => {
  it('produces one entry per day', () => {
    const result = bucketWatchesByDay([], 7, BASE)
    expect(result).toHaveLength(7)
  })

  it('buckets watches into correct day', () => {
    const watches = [{ watched_at: '2026-06-19T10:00:00Z', reward_cents: 100 }]
    const result = bucketWatchesByDay(watches, 7, BASE)
    const today = result.find(d => d.date === '2026-06-19')!
    expect(today.watches).toBe(1)
    expect(today.points).toBe(100)
  })

  it('ignores watches outside the window', () => {
    const watches = [{ watched_at: '2026-06-01T10:00:00Z', reward_cents: 100 }]
    const result = bucketWatchesByDay(watches, 7, BASE)
    const total = result.reduce((s, d) => s + d.watches, 0)
    expect(total).toBe(0)
  })

  it('accumulates multiple watches on same day', () => {
    const watches = [
      { watched_at: '2026-06-19T09:00:00Z', reward_cents: 50 },
      { watched_at: '2026-06-19T11:00:00Z', reward_cents: 75 },
    ]
    const result = bucketWatchesByDay(watches, 7, BASE)
    const today = result.find(d => d.date === '2026-06-19')!
    expect(today.watches).toBe(2)
    expect(today.points).toBe(125)
  })
})
