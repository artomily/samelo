import { describe, it, expect } from 'vitest'
import { getAchievements, countUnlocked } from '@/lib/achievements'

const emptyInput = { watchCount: 0, quizCount: 0, referralCount: 0, swapCount: 0, currentStreak: 0, longestStreak: 0, totalPoints: 0 }

describe('getAchievements', () => {
  it('returns 12 achievements', () => {
    expect(getAchievements(emptyInput)).toHaveLength(12)
  })

  it('all locked for empty stats', () => {
    const achievements = getAchievements(emptyInput)
    expect(achievements.every(a => !a.unlocked)).toBe(true)
  })

  it('unlocks first_watch when watchCount >= 1', () => {
    const achievements = getAchievements({ ...emptyInput, watchCount: 1 })
    const ach = achievements.find(a => a.id === 'first_watch')
    expect(ach?.unlocked).toBe(true)
  })

  it('unlocks streak_7 when longestStreak >= 7', () => {
    const achievements = getAchievements({ ...emptyInput, longestStreak: 7 })
    const ach = achievements.find(a => a.id === 'streak_7')
    expect(ach?.unlocked).toBe(true)
  })

  it('does not unlock watch_100 with only 99 watches', () => {
    const achievements = getAchievements({ ...emptyInput, watchCount: 99 })
    const ach = achievements.find(a => a.id === 'watch_100')
    expect(ach?.unlocked).toBe(false)
  })
})

describe('countUnlocked', () => {
  it('counts only unlocked achievements', () => {
    const achievements = getAchievements({ ...emptyInput, watchCount: 100, quizCount: 1, swapCount: 1 })
    expect(countUnlocked(achievements)).toBeGreaterThan(0)
  })
})
