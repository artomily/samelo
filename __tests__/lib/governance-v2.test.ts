import { describe, it, expect } from 'vitest'
import { getVotePct, hasReachedQuorum, isVotingOpen, timeRemainingLabel } from '@/lib/types/governance-v2'
import type { Proposal } from '@/lib/types/governance'

function makeProposal(overrides: Partial<Proposal> = {}): Proposal {
  return {
    id: 'p1',
    title: 'Test Proposal',
    description: 'Test',
    proposer_wallet: '0xabc',
    status: 'active',
    votes_for: 60,
    votes_against: 40,
    min_melo_to_vote: 1,
    starts_at: new Date(Date.now() - 1000).toISOString(),
    ends_at: new Date(Date.now() + 86400_000).toISOString(),
    metadata: {},
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

describe('getVotePct', () => {
  it('returns correct percentages', () => {
    const { forPct, againstPct } = getVotePct(makeProposal())
    expect(forPct).toBe(60)
    expect(againstPct).toBe(40)
  })

  it('returns zeros when no votes', () => {
    const { forPct, againstPct } = getVotePct(makeProposal({ votes_for: 0, votes_against: 0 }))
    expect(forPct).toBe(0)
    expect(againstPct).toBe(0)
  })
})

describe('hasReachedQuorum', () => {
  it('returns true when total >= quorum', () => {
    expect(hasReachedQuorum(60, 40, 100)).toBe(true)
  })

  it('returns false when below quorum', () => {
    expect(hasReachedQuorum(30, 20, 100)).toBe(false)
  })
})

describe('isVotingOpen', () => {
  it('returns true for active proposal with future end', () => {
    expect(isVotingOpen(makeProposal())).toBe(true)
  })

  it('returns false for passed proposal', () => {
    expect(isVotingOpen(makeProposal({ status: 'passed' }))).toBe(false)
  })

  it('returns false for active proposal with past end', () => {
    const past = new Date(Date.now() - 1000).toISOString()
    expect(isVotingOpen(makeProposal({ ends_at: past }))).toBe(false)
  })
})

describe('timeRemainingLabel', () => {
  it('returns Ended for past date', () => {
    const past = new Date(Date.now() - 1000).toISOString()
    expect(timeRemainingLabel(past)).toBe('Ended')
  })

  it('returns hours for < 24h', () => {
    const future = new Date(Date.now() + 3 * 3600_000).toISOString()
    expect(timeRemainingLabel(future)).toBe('3h left')
  })

  it('returns days for > 24h', () => {
    const future = new Date(Date.now() + 2 * 86400_000).toISOString()
    expect(timeRemainingLabel(future)).toBe('2d left')
  })
})
