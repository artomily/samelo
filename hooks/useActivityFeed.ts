import { useQuery } from '@tanstack/react-query'
import type { ActivityEvent } from '@/lib/types/activity-feed'

type FeedMode = 'public' | 'following' | 'wallet'

interface FeedResponse {
  events: ActivityEvent[]
}

export function useActivityFeed(mode: FeedMode = 'public', wallet?: string) {
  return useQuery<FeedResponse>({
    queryKey: ['activity-feed', mode, wallet],
    queryFn: async () => {
      const params = new URLSearchParams({ mode })
      if (mode === 'wallet' && wallet) params.set('wallet', wallet)
      const res = await fetch(`/api/activity?${params}`, {
        headers: wallet && mode === 'following' ? { 'x-wallet-address': wallet } : {},
      })
      if (!res.ok) throw new Error('Failed to load activity')
      return res.json()
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}

export function useWalletActivity(targetWallet: string | undefined) {
  return useActivityFeed('wallet', targetWallet)
}

export function useFollowingFeed(wallet: string | undefined) {
  return useQuery<FeedResponse>({
    queryKey: ['activity-feed', 'following', wallet],
    queryFn: async () => {
      const res = await fetch('/api/activity?mode=following', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load feed')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 30_000,
  })
}
