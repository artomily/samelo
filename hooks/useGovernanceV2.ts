import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Proposal } from '@/lib/types/governance'

export function useProposalsV2() {
  return useQuery<{ proposals: Proposal[] }>({
    queryKey: ['proposals-v2'],
    queryFn: async () => {
      const res = await fetch('/api/governance/v2')
      if (!res.ok) throw new Error('Failed to load proposals')
      return res.json()
    },
    staleTime: 60_000,
  })
}

export function useWalletVoteV2(proposalId: string, wallet: string | undefined) {
  return useQuery<{ vote: boolean | null }>({
    queryKey: ['vote-v2', proposalId, wallet],
    queryFn: async () => {
      const res = await fetch(`/api/governance/v2/vote?proposal_id=${proposalId}`, {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load vote')
      return res.json()
    },
    enabled: !!wallet && !!proposalId,
  })
}

export function useCastVoteV2(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<void, Error, { proposal_id: string; vote: boolean }>({
    mutationFn: async (body) => {
      const res = await fetch('/api/governance/v2/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet ?? '',
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? 'Vote failed')
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['proposals-v2'] })
      qc.invalidateQueries({ queryKey: ['vote-v2', vars.proposal_id, wallet] })
    },
  })
}
