import { useQuery } from '@tanstack/react-query'
import type { Video, VideoCategory, VideoDifficulty } from '@/lib/types/video'

interface CategoryFilter {
  category?: VideoCategory
  difficulty?: VideoDifficulty
}

async function fetchByCategory(filter: CategoryFilter): Promise<{ videos: Video[] }> {
  const params = new URLSearchParams()
  if (filter.category) params.set('category', filter.category)
  if (filter.difficulty) params.set('difficulty', filter.difficulty)
  const res = await fetch(`/api/videos/by-category?${params}`)
  if (!res.ok) throw new Error('Failed to fetch videos')
  return res.json()
}

export function useVideosByCategory(filter: CategoryFilter = {}) {
  return useQuery({
    queryKey: ['videos-by-category', filter.category, filter.difficulty],
    queryFn: () => fetchByCategory(filter),
    staleTime: 120_000,
  })
}
