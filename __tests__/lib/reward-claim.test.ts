import { describe, it, expect } from 'vitest'
import { isPending, isPaid, CLAIM_SOURCE_LABELS, CLAIM_STATUS_COLORS } from '@/lib/types/reward-claim'
import type { RewardClaimRequest } from '@/lib/types/reward-claim'

const makeClaim = (overrides: Partial<RewardClaimRequest> = {}): RewardClaimRequest => ({
  id: 'c1',
  wallet: '0x1234567890123456789012345678901234567890',
  source: 'leaderboard',
  amount_melo: 10,
  reference_id: null,
  status: 'pending',
  tx_hash: null,
  admin_note: null,
  requested_at: '2026-06-21T00:00:00Z',
  processed_at: null,
  ...overrides,
})

describe('isPending', () => {
  it('returns true for pending claim', () => {
    expect(isPending(makeClaim())).toBe(true)
  })

  it('returns false for paid claim', () => {
    expect(isPending(makeClaim({ status: 'paid' }))).toBe(false)
  })
})

describe('isPaid', () => {
  it('returns true for paid claim', () => {
    expect(isPaid(makeClaim({ status: 'paid' }))).toBe(true)
  })

  it('returns false for pending claim', () => {
    expect(isPaid(makeClaim())).toBe(false)
  })
})

describe('CLAIM_SOURCE_LABELS', () => {
  it('has labels for all sources', () => {
    const sources = ['leaderboard', 'referral', 'staking', 'mission', 'bonus'] as const
    for (const s of sources) {
      expect(CLAIM_SOURCE_LABELS[s]).toBeTruthy()
    }
  })
})

describe('CLAIM_STATUS_COLORS', () => {
  it('paid status is lime', () => {
    expect(CLAIM_STATUS_COLORS.paid).toBe('#c8f135')
  })

  it('failed status is red', () => {
    expect(CLAIM_STATUS_COLORS.failed).toBe('#f13535')
  })
})
