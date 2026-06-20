'use client'
import { STATUS_COLORS, STATUS_LABELS, getQuorum } from '@/lib/types/governance'
import type { ProposalWithUserVote } from '@/lib/types/governance'
import { formatRelative } from '@/lib/utils/date'

interface ProposalCardProps {
  proposal: ProposalWithUserVote
  onClick?: () => void
}

export function ProposalCard({ proposal, onClick }: ProposalCardProps) {
  const quorum = getQuorum(proposal)
  const totalVotes = proposal.votes_for + proposal.votes_against
  const statusColor = STATUS_COLORS[proposal.status]
  const isActive = proposal.status === 'active'
  const timeLeft = isActive ? formatRelative(new Date(proposal.ends_at)) : null

  return (
    <div
      className="bg-white/5 rounded-xl p-4 cursor-pointer hover:bg-white/8 transition-colors border border-white/5 hover:border-white/10"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-white leading-snug">{proposal.title}</h3>
        <span
          className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-mono"
          style={{ color: statusColor, backgroundColor: `${statusColor}20`, border: `1px solid ${statusColor}30` }}
        >
          {STATUS_LABELS[proposal.status]}
        </span>
      </div>

      <p className="text-xs text-white/40 line-clamp-2 mb-3">{proposal.description}</p>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-white/40">
          <span>For ({proposal.votes_for})</span>
          <span>Against ({proposal.votes_against})</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#c8f135] transition-all"
            style={{ width: `${Math.round(quorum * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/30">
          <span>{totalVotes} votes</span>
          {timeLeft && <span>Ends {timeLeft}</span>}
        </div>
      </div>

      {proposal.userVote && (
        <div className="mt-2 text-xs text-white/40">
          You voted: <span className={proposal.userVote === 'for' ? 'text-[#c8f135]' : 'text-red-400'}>{proposal.userVote}</span>
        </div>
      )}
    </div>
  )
}
