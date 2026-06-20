import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { SocialStats } from '@/lib/types/social'

async function fetchSocialStats(wallet: string, viewer?: string): Promise<SocialStats> {
  const params = new URLSearchParams({ wallet })
  if (viewer) params.set('viewer', viewer)
  const res = await fetch(`/api/social/stats?${params}`)
  if (!res.ok) throw new Error('Failed to fetch social stats')
  return res.json()
}

export function useSocialStats(wallet: string | null, viewer?: string | null) {
  return useQuery({
    queryKey: ['social-stats', wallet, viewer],
    queryFn: () => fetchSocialStats(wallet!, viewer ?? undefined),
    enabled: !!wallet,
    staleTime: 60_000,
  })
}

export function useFollow(follower: string | null) {
  const qc = useQueryClient()

  const follow = useMutation({
    mutationFn: async (target: string) => {
      const res = await fetch('/api/social/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follower, target }),
      })
      if (!res.ok) throw new Error('Follow failed')
    },
    onSuccess: (_, target) => {
      qc.invalidateQueries({ queryKey: ['social-stats', target] })
    },
  })

  const unfollow = useMutation({
    mutationFn: async (target: string) => {
      const res = await fetch('/api/social/follow', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follower, target }),
      })
      if (!res.ok) throw new Error('Unfollow failed')
    },
    onSuccess: (_, target) => {
      qc.invalidateQueries({ queryKey: ['social-stats', target] })
    },
  })

  return { follow, unfollow }
}
