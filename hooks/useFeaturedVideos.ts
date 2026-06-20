import { useQuery } from '@tanstack/react-query'
import type { Video } from '@/lib/types/video'

async function fetchFeaturedVideos(): Promise<{ videos: Video[] }> {
  const res = await fetch('/api/videos/featured')
  if (!res.ok) throw new Error('Failed to fetch featured videos')
  return res.json()
}

export function useFeaturedVideos() {
  return useQuery({
    queryKey: ['videos-featured'],
    queryFn: fetchFeaturedVideos,
    staleTime: 300_000, // 5 min — featured rarely changes
  })
}
