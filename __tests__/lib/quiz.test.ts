import { describe, it, expect } from 'vitest'
import {
  DIFFICULTY_COLORS,
  DIFFICULTY_MULTIPLIERS,
  TIME_BONUS_THRESHOLD_MS,
  TIME_BONUS_POINTS,
  type QuizDifficulty,
} from '@/lib/types/quiz'

describe('quiz types', () => {
  const DIFFICULTIES: QuizDifficulty[] = ['easy', 'medium', 'hard']

  it('DIFFICULTY_COLORS has a color for each difficulty', () => {
    for (const d of DIFFICULTIES) {
      expect(DIFFICULTY_COLORS[d]).toMatch(/^#/)
    }
  })

  it('DIFFICULTY_MULTIPLIERS are in ascending order', () => {
    expect(DIFFICULTY_MULTIPLIERS.easy).toBeLessThan(DIFFICULTY_MULTIPLIERS.medium)
    expect(DIFFICULTY_MULTIPLIERS.medium).toBeLessThan(DIFFICULTY_MULTIPLIERS.hard)
  })

  it('DIFFICULTY_MULTIPLIERS.easy is 1.0 (no penalty for easy)', () => {
    expect(DIFFICULTY_MULTIPLIERS.easy).toBe(1.0)
  })

  it('DIFFICULTY_MULTIPLIERS.hard is 2x (double reward)', () => {
    expect(DIFFICULTY_MULTIPLIERS.hard).toBe(2.0)
  })

  it('TIME_BONUS_THRESHOLD_MS is positive', () => {
    expect(TIME_BONUS_THRESHOLD_MS).toBeGreaterThan(0)
  })

  it('TIME_BONUS_POINTS is positive', () => {
    expect(TIME_BONUS_POINTS).toBeGreaterThan(0)
  })
})
