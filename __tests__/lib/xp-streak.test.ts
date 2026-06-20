import { describe, it, expect } from 'vitest'
import { updateStreak } from '@/lib/xp'

describe('updateStreak edge cases', () => {
  it('handles leap day continuity', () => {
    const result = updateStreak('2024-02-28', '2024-02-29')
    expect(result.currentStreak).toBe(1)
    expect(result.isNewDay).toBe(true)
  })

  it('breaks streak across month boundary correctly', () => {
    const result = updateStreak('2026-05-31', '2026-06-02')
    expect(result.currentStreak).toBe(0) // gap of 2 days
  })

  it('continues streak across month boundary', () => {
    const result = updateStreak('2026-05-31', '2026-06-01')
    expect(result.currentStreak).toBe(1)
  })

  it('same day returns isNewDay=false', () => {
    const result = updateStreak('2026-06-19', '2026-06-19')
    expect(result.isNewDay).toBe(false)
  })
})
