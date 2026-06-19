import { describe, it, expect } from 'vitest'
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS, VIDEO_CATEGORIES } from '@/lib/types/video'

describe('DIFFICULTY_LABELS', () => {
  it('has labels for all difficulties', () => {
    expect(DIFFICULTY_LABELS.beginner).toBe('Beginner')
    expect(DIFFICULTY_LABELS.intermediate).toBe('Intermediate')
    expect(DIFFICULTY_LABELS.advanced).toBe('Advanced')
  })
})

describe('DIFFICULTY_COLORS', () => {
  it('assigns distinct hex colors', () => {
    const colors = Object.values(DIFFICULTY_COLORS)
    const unique = new Set(colors)
    expect(unique.size).toBe(3)
  })

  it('beginner color is green', () => {
    expect(DIFFICULTY_COLORS.beginner).toBe('#35d07f')
  })
})

describe('VIDEO_CATEGORIES', () => {
  it('includes celo category', () => {
    expect(VIDEO_CATEGORIES).toContain('celo')
  })

  it('has 7 categories', () => {
    expect(VIDEO_CATEGORIES).toHaveLength(7)
  })
})
