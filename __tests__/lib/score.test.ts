import { describe, it, expect } from 'vitest'
import { calcEngagementScore, engagementTier } from '@/lib/score'

describe('calcEngagementScore', () => {
  it('scores zero for empty activity', () => {
    expect(calcEngagementScore({ watchCount: 0, quizCount: 0, referralCount: 0, swapCount: 0, missionCount: 0 })).toBe(0)
  })

  it('weights quizzes more than watches', () => {
    const watches = calcEngagementScore({ watchCount: 10, quizCount: 0, referralCount: 0, swapCount: 0, missionCount: 0 })
    const quizzes = calcEngagementScore({ watchCount: 0, quizCount: 10, referralCount: 0, swapCount: 0, missionCount: 0 })
    expect(quizzes).toBeGreaterThan(watches)
  })

  it('weights referrals highest per unit', () => {
    const score = calcEngagementScore({ watchCount: 0, quizCount: 0, referralCount: 1, swapCount: 0, missionCount: 0 })
    expect(score).toBe(10)
  })

  it('sums all activity types', () => {
    const score = calcEngagementScore({ watchCount: 10, quizCount: 5, referralCount: 2, swapCount: 3, missionCount: 1 })
    expect(score).toBe(10 + 15 + 20 + 15 + 8)
  })
})

describe('engagementTier', () => {
  it('returns Observer for score < 50', () => {
    expect(engagementTier(0)).toBe('Observer')
    expect(engagementTier(49)).toBe('Observer')
  })

  it('returns Watcher for score 50-199', () => {
    expect(engagementTier(50)).toBe('Watcher')
    expect(engagementTier(199)).toBe('Watcher')
  })

  it('returns Miner for score 200-499', () => {
    expect(engagementTier(200)).toBe('Miner')
  })

  it('returns Pioneer for score 500-999', () => {
    expect(engagementTier(500)).toBe('Pioneer')
  })

  it('returns Legend for score >= 1000', () => {
    expect(engagementTier(1000)).toBe('Legend')
    expect(engagementTier(9999)).toBe('Legend')
  })
})
