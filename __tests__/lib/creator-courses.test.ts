import { describe, it, expect } from 'vitest'
import {
  SKILL_LEVEL_LABELS,
  SKILL_LEVEL_COLORS,
  isFree,
  formatDuration,
} from '@/lib/types/creator-courses'
import type { Course } from '@/lib/types/creator-courses'

function makeCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: 'c1',
    creator_wallet: '0xabc',
    title: 'DeFi Crash Course',
    description: null,
    cover_url: null,
    skill_level: 'beginner',
    price_melo: 0,
    is_published: true,
    estimated_minutes: null,
    lesson_count: 0,
    enrollee_count: 0,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('SKILL_LEVEL_LABELS', () => {
  it('labels all skill levels', () => {
    expect(SKILL_LEVEL_LABELS.beginner).toBe('Beginner')
    expect(SKILL_LEVEL_LABELS.intermediate).toBe('Intermediate')
    expect(SKILL_LEVEL_LABELS.advanced).toBe('Advanced')
  })
})

describe('SKILL_LEVEL_COLORS', () => {
  it('assigns neon lime to advanced', () => {
    expect(SKILL_LEVEL_COLORS.advanced).toBe('#c8f135')
  })
})

describe('isFree', () => {
  it('returns true when price is 0', () => {
    expect(isFree(makeCourse({ price_melo: 0 }))).toBe(true)
  })

  it('returns false when price > 0', () => {
    expect(isFree(makeCourse({ price_melo: 50 }))).toBe(false)
  })
})

describe('formatDuration', () => {
  it('returns TBD for null', () => {
    expect(formatDuration(null)).toBe('TBD')
  })

  it('formats minutes only', () => {
    expect(formatDuration(45)).toBe('45m')
  })

  it('formats hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h 30m')
  })

  it('formats whole hours', () => {
    expect(formatDuration(120)).toBe('2h')
  })
})
