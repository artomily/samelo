'use client'
import { useState } from 'react'
import { useProposals } from '@/hooks/useProposals'
import { ProposalCard } from './ProposalCard'
import { Skeleton } from '@/components/ui/Skeleton'

const STATUS_TABS = [
  { value: undefined, label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'passed', label: 'Passed' },
  { value: 'rejected', label: 'Rejected' },
]

export function ProposalList() {
  const [status, setStatus] = useState<string | undefined>(undefined)
  const { data, isLoading } = useProposals(status)

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.label}
            onClick={() => setStatus(tab.value)}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
              status === tab.value
                ? 'bg-[#c8f135] text-black font-medium'
                : 'bg-white/10 text-white/60 hover:bg-white/15'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : data?.proposals.length === 0 ? (
        <div className="text-center py-12 text-white/40">
          <p className="text-4xl mb-3">🗳️</p>
          <p className="text-sm">No proposals yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.proposals.map(p => (
            <ProposalCard key={p.id} proposal={p} />
          ))}
        </div>
      )}
    </div>
  )
}
