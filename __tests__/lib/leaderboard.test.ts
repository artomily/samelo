import { describe, it, expect } from 'vitest'
import { getMedalEmoji, PERIOD_LABELS } from '../../lib/types/leaderboard'

describe('getMedalEmoji', () => {
  it('returns gold medal for rank 1', () => {
    expect(getMedalEmoji(1)).toBe('🥇')
  })

  it('returns silver medal for rank 2', () => {
    expect(getMedalEmoji(2)).toBe('🥈')
  })

  it('returns bronze medal for rank 3', () => {
    expect(getMedalEmoji(3)).toBe('🥉')
  })

  it('returns #N for ranks beyond 3', () => {
    expect(getMedalEmoji(4)).toBe('#4')
    expect(getMedalEmoji(100)).toBe('#100')
  })
})

describe('PERIOD_LABELS', () => {
  it('has label for each period', () => {
    expect(PERIOD_LABELS.daily).toBe('Today')
    expect(PERIOD_LABELS.weekly).toBe('This Week')
    expect(PERIOD_LABELS.alltime).toBe('All Time')
  })
})
