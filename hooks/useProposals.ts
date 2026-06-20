'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import type { ProposalWithUserVote, VoteChoice } from '@/lib/types/governance'

export function useProposals(status?: string) {
  return useQuery<{ proposals: ProposalWithUserVote[] }>({
    queryKey: ['proposals', status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : ''
      const res = await fetch(`/api/governance/proposals${params}`)
      if (!res.ok) throw new Error('Failed to fetch proposals')
      return res.json()
    },
    staleTime: 30_000,
  })
}

export function useProposal(id: string | undefined) {
  const { address } = useAccount()

  return useQuery<{ proposal: ProposalWithUserVote }>({
    queryKey: ['proposal', id, address],
    queryFn: async () => {
      const params = address ? `?wallet=${address}` : ''
      const res = await fetch(`/api/governance/proposals/${id}${params}`)
      if (!res.ok) throw new Error('Failed to fetch proposal')
      return res.json()
    },
    enabled: !!id,
    staleTime: 15_000,
  })
}

export function useCastVote(proposalId: string) {
  const { address } = useAccount()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (choice: VoteChoice) => {
      const res = await fetch(`/api/governance/proposals/${proposalId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address ?? '',
        },
        body: JSON.stringify({ vote: choice }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['proposal', proposalId] })
      qc.invalidateQueries({ queryKey: ['proposals'] })
    },
  })
}
