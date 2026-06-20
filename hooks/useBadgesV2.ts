import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useBadgesV2(wallet?: string) {
  return useQuery({
    queryKey: ['badges-v2', wallet],
    queryFn: async () => {
      const res = await fetch('/api/badges/v2', {
        headers: wallet ? { 'x-wallet-address': wallet } : {},
      })
      if (!res.ok) throw new Error('Failed to fetch badges')
      return res.json() as Promise<{ badges: unknown[]; earnedCount: number }>
    },
  })
}

export function useAwardBadge(wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: {
      recipient_wallet: string
      badge_type_id: string
      reason?: string
      token_id?: string
    }) => {
      const res = await fetch('/api/badges/v2', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to award badge')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['badges-v2'] }),
  })
}
