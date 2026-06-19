import { useQuery } from '@tanstack/react-query'

interface WatchStats {
  totalWatches: number
  totalPoints: number
  claimedPoints: number
  unclaimedPoints: number
  quizAttempts: number
  lastWatchedAt: string | null
}

async function fetchWatchStats(walletAddress: string): Promise<WatchStats> {
  const res = await fetch(`/api/watch/stats?walletAddress=${walletAddress}`)
  if (!res.ok) throw new Error('Failed to fetch watch stats')
  return res.json()
}

export function useWatchStats(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ['watch-stats', walletAddress],
    queryFn: () => fetchWatchStats(walletAddress!),
    enabled: !!walletAddress,
    staleTime: 30_000,
  })
}
