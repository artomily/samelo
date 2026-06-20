'use client'

import { getVotePct, hasReachedQuorum, isVotingOpen, timeRemainingLabel } from '@/lib/types/governance-v2'
import { useCastVoteV2, useWalletVoteV2 } from '@/hooks/useGovernanceV2'
import { STATUS_LABELS } from '@/lib/types/governance'
import type { Proposal } from '@/lib/types/governance'

interface Props {
  proposal: Proposal
  wallet?: string
}

export function ProposalCardV2({ proposal, wallet }: Props) {
  const { forPct, againstPct } = getVotePct(proposal)
  const quorum = hasReachedQuorum(proposal.votes_for, proposal.votes_against, proposal.quorum_required ?? 0)
  const open = isVotingOpen(proposal)
  const { data: voteData } = useWalletVoteV2(proposal.id, wallet)
  const { mutate: castVote, isPending } = useCastVoteV2(wallet)
  const userVote = voteData?.vote

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold">{proposal.title}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          {open && <span className="text-xs text-white/40">{timeRemainingLabel(proposal.ends_at)}</span>}
          <span className={['text-xs px-2 py-0.5 rounded-full', open ? 'bg-[#c8f135]/20 text-[#c8f135]' : 'bg-white/10 text-white/40'].join(' ')}>
            {STATUS_LABELS[proposal.status]}
          </span>
        </div>
      </div>

      <p className="text-xs text-white/50 leading-snug">{proposal.description}</p>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-white/40">
          <span>For {forPct}%</span>
          <span>Against {againstPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${forPct}%`, background: '#c8f135' }} />
        </div>
        <p className="text-xs text-white/30">
          {quorum ? 'Quorum reached' : `${proposal.votes_for + proposal.votes_against} / ${proposal.quorum_required} votes`}
        </p>
      </div>

      {open && wallet && userVote === null && (
        <div className="flex gap-2">
          <button
            onClick={() => castVote({ proposal_id: proposal.id, vote: true })}
            disabled={isPending}
            className="flex-1 py-2 text-sm rounded font-medium disabled:opacity-40"
            style={{ background: '#c8f135', color: '#030303' }}
          >
            Vote For
          </button>
          <button
            onClick={() => castVote({ proposal_id: proposal.id, vote: false })}
            disabled={isPending}
            className="flex-1 py-2 text-sm rounded border border-white/20 disabled:opacity-40"
          >
            Vote Against
          </button>
        </div>
      )}
      {userVote !== null && userVote !== undefined && (
        <p className="text-xs text-white/40">You voted: {userVote ? 'For' : 'Against'}</p>
      )}
    </div>
  )
}
