import { describe, it, expect } from 'vitest'
import { calcNetAmount, calcPlatformFee, SOURCE_LABELS, DEFAULT_PLATFORM_FEE_PCT } from '@/lib/types/creator-monetization'
import type { EarningsSourceType } from '@/lib/types/creator-monetization'

describe('calcPlatformFee', () => {
  it('calculates 20% fee correctly', () => {
    expect(calcPlatformFee(100)).toBe(20)
  })

  it('uses custom fee pct', () => {
    expect(calcPlatformFee(100, 10)).toBe(10)
  })

  it('returns 0 for 0% fee', () => {
    expect(calcPlatformFee(100, 0)).toBe(0)
  })
})

describe('calcNetAmount', () => {
  it('returns 80% of gross at 20% fee', () => {
    expect(calcNetAmount(100)).toBe(80)
  })

  it('fee + net = gross', () => {
    const gross = 123.456
    const fee = calcPlatformFee(gross)
    const net = calcNetAmount(gross)
    expect(parseFloat((fee + net).toFixed(8))).toBe(parseFloat(gross.toFixed(8)))
  })
})

describe('SOURCE_LABELS', () => {
  it('has labels for all source types', () => {
    const types: EarningsSourceType[] = ['watch_reward', 'quiz_reward', 'tip', 'subscription_share', 'referral']
    for (const t of types) {
      expect(SOURCE_LABELS[t]).toBeTruthy()
    }
  })
})

describe('DEFAULT_PLATFORM_FEE_PCT', () => {
  it('is 20%', () => {
    expect(DEFAULT_PLATFORM_FEE_PCT).toBe(20)
  })
})
