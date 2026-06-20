import { describe, it, expect, vi } from 'vitest'
import { toDateString, daysBetween, isToday, isYesterday, addDays, formatRelative } from '@/lib/utils/date'

describe('toDateString', () => {
  it('formats date to YYYY-MM-DD', () => {
    expect(toDateString(new Date('2026-06-20T12:00:00Z'))).toBe('2026-06-20')
  })
})

describe('daysBetween', () => {
  it('calculates days between dates', () => {
    expect(daysBetween('2026-06-10', '2026-06-20')).toBe(10)
  })

  it('is symmetric', () => {
    expect(daysBetween('2026-06-20', '2026-06-10')).toBe(10)
  })
})

describe('isToday', () => {
  it('returns true for today', () => {
    expect(isToday(new Date())).toBe(true)
  })

  it('returns false for yesterday', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    expect(isToday(yesterday)).toBe(false)
  })
})

describe('addDays', () => {
  it('adds days to a date', () => {
    const result = addDays('2026-06-10', 5)
    expect(toDateString(result)).toBe('2026-06-15')
  })
})

describe('formatRelative', () => {
  it('returns just now for recent', () => {
    const recent = new Date(Date.now() - 5000)
    expect(formatRelative(recent)).toBe('just now')
  })

  it('returns minutes for < 1 hour', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60_000)
    expect(formatRelative(fiveMinAgo)).toBe('5m ago')
  })

  it('returns hours for < 1 day', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 3_600_000)
    expect(formatRelative(twoHoursAgo)).toBe('2h ago')
  })
})
