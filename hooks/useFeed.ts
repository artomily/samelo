import { useQuery } from '@tanstack/react-query'
import type { ActivityEvent } from '@/lib/types/social'

async function fetchFeed(wallet: string, limit = 20): Promise<{ events: ActivityEvent[] }> {
  const res = await fetch(`/api/social/feed?wallet=${wallet}&limit=${limit}`)
  if (!res.ok) throw new Error('Failed to fetch feed')
  return res.json()
}

export function useFeed(wallet: string | null, limit = 20) {
  return useQuery({
    queryKey: ['feed', wallet, limit],
    queryFn: () => fetchFeed(wallet!, limit),
    enabled: !!wallet,
    refetchInterval: 30_000,
  })
}
