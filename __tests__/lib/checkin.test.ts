import { describe, it, expect } from 'vitest'
import { calcCheckinPoints, getStreakMessage, BASE_CHECKIN_POINTS, MAX_CHECKIN_STREAK_BONUS, STREAK_BONUS_PER_DAY } from '../../lib/types/checkin'

describe('calcCheckinPoints', () => {
  it('returns base points for first day', () => {
    expect(calcCheckinPoints(1)).toBe(BASE_CHECKIN_POINTS + STREAK_BONUS_PER_DAY)
  })

  it('increases with streak', () => {
    const day1 = calcCheckinPoints(1)
    const day2 = calcCheckinPoints(2)
    expect(day2).toBeGreaterThan(day1)
  })

  it('caps at max bonus', () => {
    const high = calcCheckinPoints(1000)
    const expected = BASE_CHECKIN_POINTS + MAX_CHECKIN_STREAK_BONUS
    expect(high).toBe(expected)
  })

  it('day 0 returns base only', () => {
    expect(calcCheckinPoints(0)).toBe(BASE_CHECKIN_POINTS)
  })
})

describe('getStreakMessage', () => {
  it('returns legendary for >= 30 days', () => {
    expect(getStreakMessage(30)).toContain('Legendary')
  })

  it('returns incredible for >= 14 days', () => {
    expect(getStreakMessage(14)).toContain('Incredible')
  })

  it('returns on fire for >= 7 days', () => {
    expect(getStreakMessage(7)).toContain('fire')
  })

  it('returns keep going for 1 day', () => {
    expect(getStreakMessage(1)).toBeTruthy()
  })
})
