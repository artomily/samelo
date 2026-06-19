import { describe, it, expect } from 'vitest'
import { daysAgo, lastNDays, shortDateLabel } from '@/lib/date-range'

const BASE = new Date('2026-06-19T12:00:00Z')

describe('daysAgo', () => {
  it('returns start of day N days before base', () => {
    const result = daysAgo(7, BASE)
    expect(result).toBe('2026-06-12T00:00:00.000Z')
  })

  it('returns start of today for 0 days', () => {
    const result = daysAgo(0, BASE)
    expect(result).toBe('2026-06-19T00:00:00.000Z')
  })
})

describe('lastNDays', () => {
  it('returns an array of N date strings', () => {
    const result = lastNDays(3, BASE)
    expect(result).toHaveLength(3)
    expect(result).toEqual(['2026-06-17', '2026-06-18', '2026-06-19'])
  })

  it('returns single date for N=1', () => {
    const result = lastNDays(1, BASE)
    expect(result).toEqual(['2026-06-19'])
  })
})

describe('shortDateLabel', () => {
  it('formats ISO date to short label', () => {
    expect(shortDateLabel('2026-06-19')).toBe('Jun 19')
    expect(shortDateLabel('2026-01-01')).toBe('Jan 1')
  })
})
