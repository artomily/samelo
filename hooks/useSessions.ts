import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { WalletSession } from '@/lib/types/session'

export function useActiveSessions(wallet: string | undefined) {
  return useQuery<{ sessions: WalletSession[] }>({
    queryKey: ['sessions', wallet],
    queryFn: async () => {
      const res = await fetch('/api/sessions', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load sessions')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })
}

export function useRevokeAllSessions(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      const res = await fetch('/api/sessions', {
        method: 'DELETE',
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to revoke sessions')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sessions', wallet] }),
  })
}
