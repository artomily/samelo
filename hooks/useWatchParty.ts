import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { WatchParty, WatchPartyParticipant } from '@/lib/types/watch-party'

export function useLiveParties() {
  return useQuery<{ parties: WatchParty[] }>({
    queryKey: ['watch-parties'],
    queryFn: async () => {
      const res = await fetch('/api/watch-party')
      if (!res.ok) throw new Error('Failed to load parties')
      return res.json()
    },
    staleTime: 15_000,
  })
}

export function useWatchPartyDetail(id: string | undefined) {
  return useQuery<{ party: WatchParty; participants: WatchPartyParticipant[] }>({
    queryKey: ['watch-party', id],
    queryFn: async () => {
      const res = await fetch(`/api/watch-party/${id}`)
      if (!res.ok) throw new Error('Party not found')
      return res.json()
    },
    enabled: !!id,
    refetchInterval: 5000,
  })
}

export function useWatchPartyAction(id: string, wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<void, Error, 'join' | 'leave' | 'start'>({
    mutationFn: async (action) => {
      const res = await fetch(`/api/watch-party/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet ?? '',
        },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) throw new Error(`Failed: ${action}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['watch-party', id] })
      qc.invalidateQueries({ queryKey: ['watch-parties'] })
    },
  })
}
