import type { Proposal } from './governance'

export function getVotePct(proposal: Proposal): { forPct: number; againstPct: number } {
  const total = proposal.votes_for + proposal.votes_against
  if (!total) return { forPct: 0, againstPct: 0 }
  return {
    forPct: Math.round((proposal.votes_for / total) * 100),
    againstPct: Math.round((proposal.votes_against / total) * 100),
  }
}

export function hasReachedQuorum(votesFor: number, votesAgainst: number, quorum: number): boolean {
  return (votesFor + votesAgainst) >= quorum
}

export function isVotingOpen(proposal: Proposal): boolean {
  return proposal.status === 'active' && new Date(proposal.ends_at) > new Date()
}

export function timeRemainingLabel(endsAt: string): string {
  const ms = new Date(endsAt).getTime() - Date.now()
  if (ms <= 0) return 'Ended'
  const hours = Math.floor(ms / 3600_000)
  if (hours < 24) return `${hours}h left`
  const days = Math.floor(hours / 24)
  return `${days}d left`
}
