'use client'
import { useParams } from 'next/navigation'
import { useProposal } from '@/hooks/useProposals'
import { VoteButtons } from '@/components/governance/VoteButtons'
import { STATUS_LABELS, STATUS_COLORS, getQuorum } from '@/lib/types/governance'
import { Skeleton } from '@/components/ui/Skeleton'

export default function ProposalPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useProposal(id)
  const proposal = data?.proposal

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#030303] text-white px-4 py-8 max-w-lg mx-auto">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-12 w-full" />
      </main>
    )
  }

  if (!proposal) return <main className="text-center py-20 text-white/40">Proposal not found</main>

  const quorum = getQuorum(proposal)
  const totalVotes = proposal.votes_for + proposal.votes_against
  const isActive = proposal.status === 'active'

  return (
    <main className="min-h-screen bg-[#030303] text-white px-4 py-8 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-mono"
          style={{ color: STATUS_COLORS[proposal.status], backgroundColor: `${STATUS_COLORS[proposal.status]}20` }}
        >
          {STATUS_LABELS[proposal.status]}
        </span>
      </div>

      <h1 className="font-display text-xl text-white mb-3">{proposal.title}</h1>
      <p className="text-sm text-white/60 mb-6 leading-relaxed">{proposal.description}</p>

      <div className="bg-white/5 rounded-xl p-4 mb-6">
        <div className="flex justify-between text-xs text-white/40 mb-2">
          <span>For: {proposal.votes_for}</span>
          <span>{Math.round(quorum * 100)}% approval</span>
          <span>Against: {proposal.votes_against}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#c8f135] transition-all"
            style={{ width: `${Math.round(quorum * 100)}%` }}
          />
        </div>
        <p className="text-xs text-white/30 mt-2 text-right">{totalVotes} total votes</p>
      </div>

      {isActive && (
        <VoteButtons
          proposalId={proposal.id}
          currentVote={proposal.userVote}
        />
      )}
    </main>
  )
}
