export type ProposalStatus = 'active' | 'passed' | 'rejected' | 'cancelled'
export type VoteChoice = 'for' | 'against'

export interface Proposal {
  id: string
  title: string
  description: string
  proposer_wallet: string
  status: ProposalStatus
  votes_for: number
  votes_against: number
  min_melo_to_vote: number
  starts_at: string
  ends_at: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface Vote {
  proposal_id: string
  voter_wallet: string
  vote: VoteChoice
  melo_weight: number
  created_at: string
}

export interface ProposalWithUserVote extends Proposal {
  userVote?: VoteChoice | null
}

export const STATUS_COLORS: Record<ProposalStatus, string> = {
  active: '#c8f135',
  passed: '#34d399',
  rejected: '#f87171',
  cancelled: '#6b7280',
}

export const STATUS_LABELS: Record<ProposalStatus, string> = {
  active: 'Voting Open',
  passed: 'Passed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
}

export function getQuorum(proposal: Proposal): number {
  const total = proposal.votes_for + proposal.votes_against
  if (total === 0) return 0
  return proposal.votes_for / total
}
