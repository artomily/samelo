import { describe, it, expect } from 'vitest'
import { formatDelta, SOURCE_LABELS, SOURCE_ICONS } from '@/lib/types/points-history'

describe('formatDelta', () => {
  it('prefixes positive numbers with +', () => {
    expect(formatDelta(50)).toBe('+50')
    expect(formatDelta(1)).toBe('+1')
  })

  it('shows negative numbers as-is', () => {
    expect(formatDelta(-20)).toBe('-20')
  })

  it('shows zero as +0', () => {
    expect(formatDelta(0)).toBe('+0')
  })
})

describe('SOURCE_LABELS', () => {
  it('has labels for all 10 sources', () => {
    expect(Object.keys(SOURCE_LABELS)).toHaveLength(10)
  })

  it('includes key sources', () => {
    expect(SOURCE_LABELS.watch).toBe('Watch')
    expect(SOURCE_LABELS.checkin).toBe('Check-in')
    expect(SOURCE_LABELS.admin).toBe('Admin')
  })
})

describe('SOURCE_ICONS', () => {
  it('has icons for all 10 sources', () => {
    expect(Object.keys(SOURCE_ICONS)).toHaveLength(10)
  })

  it('all icons are non-empty strings', () => {
    for (const icon of Object.values(SOURCE_ICONS)) {
      expect(typeof icon).toBe('string')
      expect(icon.length).toBeGreaterThan(0)
    }
  })
})
