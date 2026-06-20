import { describe, it, expect } from 'vitest'
import {
  REWARD_TIERS,
  getTierForPoints,
  POINTS_PER_VIDEO,
  POINTS_PER_QUIZ,
  STREAK_BONUS_PER_DAY,
  MAX_STREAK_BONUS,
} from '@/lib/types/rewards'

describe('reward tiers', () => {
  it('REWARD_TIERS has 4 tiers', () => {
    expect(REWARD_TIERS).toHaveLength(4)
  })

  it('tiers are ordered by min_daily_points ascending', () => {
    for (let i = 1; i < REWARD_TIERS.length; i++) {
      expect(REWARD_TIERS[i].min_daily_points).toBeGreaterThan(REWARD_TIERS[i - 1].min_daily_points)
    }
  })

  it('getTierForPoints returns Starter for 0 points', () => {
    expect(getTierForPoints(0).name).toBe('Starter')
  })

  it('getTierForPoints returns Active for 100 points', () => {
    expect(getTierForPoints(100).name).toBe('Active')
  })

  it('getTierForPoints returns Super for 300 points', () => {
    expect(getTierForPoints(300).name).toBe('Super')
  })

  it('getTierForPoints returns Legend for 600+ points', () => {
    expect(getTierForPoints(600).name).toBe('Legend')
    expect(getTierForPoints(999).name).toBe('Legend')
  })

  it('POINTS_PER_VIDEO is positive', () => {
    expect(POINTS_PER_VIDEO).toBeGreaterThan(0)
  })

  it('POINTS_PER_QUIZ is greater than POINTS_PER_VIDEO', () => {
    expect(POINTS_PER_QUIZ).toBeGreaterThan(POINTS_PER_VIDEO)
  })

  it('MAX_STREAK_BONUS caps streak bonus', () => {
    expect(MAX_STREAK_BONUS).toBeGreaterThan(0)
    expect(STREAK_BONUS_PER_DAY * 100).toBeGreaterThan(MAX_STREAK_BONUS)
  })
})
