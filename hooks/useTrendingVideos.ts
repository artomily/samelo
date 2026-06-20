import { useQuery } from '@tanstack/react-query'
import type { Video } from '@/lib/types/video'

async function fetchTrendingVideos(): Promise<{ videos: Video[]; period: string }> {
  const res = await fetch('/api/videos/trending')
  if (!res.ok) throw new Error('Failed to fetch trending videos')
  return res.json()
}

export function useTrendingVideos() {
  return useQuery({
    queryKey: ['videos-trending'],
    queryFn: fetchTrendingVideos,
    staleTime: 60_000,
    refetchInterval: 120_000,
  })
}
