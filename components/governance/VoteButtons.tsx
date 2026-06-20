'use client'
import { useCastVote } from '@/hooks/useProposals'
import { useAccount } from 'wagmi'
import type { VoteChoice } from '@/lib/types/governance'

interface VoteButtonsProps {
  proposalId: string
  currentVote?: VoteChoice | null
  disabled?: boolean
}

export function VoteButtons({ proposalId, currentVote, disabled }: VoteButtonsProps) {
  const { address } = useAccount()
  const { mutate: vote, isPending, error } = useCastVote(proposalId)

  if (!address) {
    return <p className="text-xs text-white/40">Connect wallet to vote</p>
  }

  if (currentVote) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-white/40">You voted:</span>
        <span className={currentVote === 'for' ? 'text-[#c8f135] font-medium' : 'text-red-400 font-medium'}>
          {currentVote === 'for' ? '✓ For' : '✗ Against'}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          onClick={() => vote('for')}
          disabled={isPending || disabled}
          className="flex-1 py-2 text-sm font-medium bg-[#c8f135] text-black rounded-lg hover:bg-[#d4f550] disabled:opacity-40 transition-colors"
        >
          {isPending ? '…' : '✓ Vote For'}
        </button>
        <button
          onClick={() => vote('against')}
          disabled={isPending || disabled}
          className="flex-1 py-2 text-sm font-medium bg-white/10 text-white rounded-lg hover:bg-white/15 disabled:opacity-40 transition-colors"
        >
          {isPending ? '…' : '✗ Vote Against'}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{(error as Error).message}</p>}
    </div>
  )
}
