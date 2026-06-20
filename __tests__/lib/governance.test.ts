import { describe, it, expect } from 'vitest'
import { STATUS_COLORS, STATUS_LABELS, getQuorum, type Proposal } from '@/lib/types/governance'

const makeProposal = (override: Partial<Proposal> = {}): Proposal => ({
  id: 'test-id',
  title: 'Test Proposal',
  description: 'A proposal',
  proposer_wallet: '0x1234',
  status: 'active',
  votes_for: 70,
  votes_against: 30,
  min_melo_to_vote: 100,
  starts_at: new Date().toISOString(),
  ends_at: new Date(Date.now() + 86400000).toISOString(),
  metadata: {},
  created_at: new Date().toISOString(),
  ...override,
})

describe('governance types', () => {
  it('STATUS_COLORS has color for every status', () => {
    for (const status of ['active', 'passed', 'rejected', 'cancelled'] as const) {
      expect(STATUS_COLORS[status]).toMatch(/^#/)
    }
  })

  it('STATUS_LABELS has label for every status', () => {
    for (const status of ['active', 'passed', 'rejected', 'cancelled'] as const) {
      expect(STATUS_LABELS[status]).toBeTruthy()
    }
  })

  it('getQuorum returns correct ratio', () => {
    const p = makeProposal({ votes_for: 70, votes_against: 30 })
    expect(getQuorum(p)).toBeCloseTo(0.7)
  })

  it('getQuorum returns 0 when no votes', () => {
    const p = makeProposal({ votes_for: 0, votes_against: 0 })
    expect(getQuorum(p)).toBe(0)
  })

  it('getQuorum returns 1 when all votes are for', () => {
    const p = makeProposal({ votes_for: 50, votes_against: 0 })
    expect(getQuorum(p)).toBe(1)
  })
})
