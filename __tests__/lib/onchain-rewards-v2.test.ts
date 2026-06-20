import { describe, it, expect } from 'vitest'
import { isTerminal, isPending, REWARD_TYPE_LABELS, STATUS_COLORS_ONCHAIN } from '@/lib/types/onchain-rewards-v2'
import type { OnchainRewardQueue } from '@/lib/types/onchain-rewards-v2'

const makeReward = (overrides: Partial<OnchainRewardQueue> = {}): OnchainRewardQueue => ({
  id: 'r1',
  wallet: '0x1234567890123456789012345678901234567890',
  reward_type: 'watch_milestone',
  amount_melo: 5,
  reference_id: null,
  oracle_signature: null,
  nonce: 'abc123',
  status: 'queued',
  tx_hash: null,
  error_message: null,
  created_at: '2026-06-21T00:00:00Z',
  processed_at: null,
  ...overrides,
})

describe('isTerminal', () => {
  it('returns true for confirmed', () => {
    expect(isTerminal(makeReward({ status: 'confirmed' }))).toBe(true)
  })

  it('returns true for failed', () => {
    expect(isTerminal(makeReward({ status: 'failed' }))).toBe(true)
  })

  it('returns false for queued', () => {
    expect(isTerminal(makeReward())).toBe(false)
  })
})

describe('isPending', () => {
  it('returns true for queued', () => {
    expect(isPending(makeReward())).toBe(true)
  })

  it('returns true for submitted', () => {
    expect(isPending(makeReward({ status: 'submitted' }))).toBe(true)
  })

  it('returns false for confirmed', () => {
    expect(isPending(makeReward({ status: 'confirmed' }))).toBe(false)
  })
})

describe('REWARD_TYPE_LABELS', () => {
  it('has label for every reward type', () => {
    const types = ['watch_milestone', 'streak_bonus', 'quiz_perfect', 'referral_bonus', 'level_up_bonus'] as const
    for (const t of types) {
      expect(REWARD_TYPE_LABELS[t]).toBeTruthy()
    }
  })
})

describe('STATUS_COLORS_ONCHAIN', () => {
  it('confirmed is lime', () => {
    expect(STATUS_COLORS_ONCHAIN.confirmed).toBe('#c8f135')
  })

  it('failed is red', () => {
    expect(STATUS_COLORS_ONCHAIN.failed).toBe('#f13535')
  })
})
