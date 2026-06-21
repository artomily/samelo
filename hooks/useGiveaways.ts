import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Giveaway, GiveawayEntry } from '@/lib/types/giveaways'

export function useActiveGiveaways() {
  return useQuery({
    queryKey: ['giveaways'],
    queryFn: async () => {
      const res = await fetch('/api/giveaways')
      if (!res.ok) throw new Error('Failed to fetch giveaways')
      return res.json() as Promise<{ giveaways: Giveaway[] }>
    },
    refetchInterval: 60_000,
  })
}

export function useGiveawayDetail(id: string, wallet?: string) {
  return useQuery({
    queryKey: ['giveaway', id, wallet],
    queryFn: async () => {
      const res = await fetch(`/api/giveaways/${id}`, {
        headers: wallet ? { 'x-wallet-address': wallet } : {},
      })
      if (!res.ok) throw new Error('Failed to fetch giveaway')
      return res.json() as Promise<{ giveaway: Giveaway; entry: GiveawayEntry | null }>
    },
    enabled: !!id,
  })
}

export function useEnterGiveaway(giveawayId: string, wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/giveaways/${giveawayId}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify({}),
      })
      if (!res.ok) throw new Error('Failed to enter giveaway')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['giveaway', giveawayId] })
      qc.invalidateQueries({ queryKey: ['giveaways'] })
    },
  })
}
