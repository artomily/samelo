import { useInfiniteQuery } from '@tanstack/react-query'

interface WatchHistoryItem {
  id: string
  video_id: string
  video_title: string
  points_earned: number
  watched_at: string
  quiz_completed: boolean
}

interface WatchHistoryPage {
  items: WatchHistoryItem[]
  nextCursor: string | null
  totalCount: number
}

async function fetchWatchHistory(walletAddress: string, cursor?: string): Promise<WatchHistoryPage> {
  const params = new URLSearchParams({ walletAddress })
  if (cursor) params.set('cursor', cursor)
  const res = await fetch(`/api/earnings/history?${params}`)
  if (!res.ok) throw new Error('Failed to fetch watch history')
  return res.json()
}

export function useWatchHistory(walletAddress: string | undefined) {
  return useInfiniteQuery({
    queryKey: ['watch-history', walletAddress],
    queryFn: ({ pageParam }) => fetchWatchHistory(walletAddress!, pageParam as string | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!walletAddress,
    staleTime: 30_000,
  })
}
