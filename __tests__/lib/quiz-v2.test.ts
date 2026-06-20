import { describe, it, expect } from 'vitest'
import {
  calcQuizPoints,
  getQuizFeedback,
  SPEED_BONUS_THRESHOLD_MS,
  SPEED_BONUS_MULTIPLIER,
} from '@/lib/types/quiz-v2'

describe('calcQuizPoints', () => {
  it('returns 0 for wrong answer', () => {
    expect(calcQuizPoints(10, false, 1000)).toBe(0)
  })

  it('returns base points for correct answer without speed bonus', () => {
    expect(calcQuizPoints(10, true, SPEED_BONUS_THRESHOLD_MS + 1)).toBe(10)
  })

  it('applies speed bonus for fast answers', () => {
    const points = calcQuizPoints(10, true, SPEED_BONUS_THRESHOLD_MS - 1)
    expect(points).toBe(Math.floor(10 * SPEED_BONUS_MULTIPLIER))
  })

  it('returns 0 for wrong answer even if fast', () => {
    expect(calcQuizPoints(20, false, 100)).toBe(0)
  })

  it('handles null timeTakenMs (no speed bonus)', () => {
    expect(calcQuizPoints(10, true, null)).toBe(10)
  })
})

describe('getQuizFeedback', () => {
  it('returns Correct! for correct without explanation', () => {
    expect(getQuizFeedback(true, null)).toBe('Correct!')
  })

  it('includes explanation for correct', () => {
    expect(getQuizFeedback(true, 'Because X')).toBe('Correct! Because X')
  })

  it('returns Wrong. for incorrect without explanation', () => {
    expect(getQuizFeedback(false, null)).toBe('Wrong answer.')
  })

  it('includes explanation for incorrect', () => {
    expect(getQuizFeedback(false, 'Because Y')).toBe('Wrong. Because Y')
  })
})
