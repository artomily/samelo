import { describe, it, expect } from 'vitest'
import {
  CELO_CHAIN_ID,
  CELO_TESTNET_CHAIN_ID,
  MIN_SWAP_POINTS,
  POINTS_PER_SECOND,
  MAX_WATCH_SECONDS,
  REFERRAL_BONUS_POINTS,
  DAILY_WATCH_LIMIT,
} from '@/lib/constants'

describe('protocol constants', () => {
  it('uses Celo Mainnet chain ID 42220', () => {
    expect(CELO_CHAIN_ID).toBe(42220)
  })

  it('uses Alfajores Testnet chain ID 44787', () => {
    expect(CELO_TESTNET_CHAIN_ID).toBe(44787)
  })

  it('requires minimum 500 points to swap', () => {
    expect(MIN_SWAP_POINTS).toBe(500)
  })

  it('caps watch reward at 300 seconds', () => {
    expect(MAX_WATCH_SECONDS).toBe(300)
  })

  it('awards 100 bonus points for referrals', () => {
    expect(REFERRAL_BONUS_POINTS).toBe(100)
  })

  it('limits daily watches to 50 per wallet', () => {
    expect(DAILY_WATCH_LIMIT).toBe(50)
  })

  it('POINTS_PER_SECOND is positive', () => {
    expect(POINTS_PER_SECOND).toBeGreaterThan(0)
  })
})
