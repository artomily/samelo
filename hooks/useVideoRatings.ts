import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { VideoRating, VideoRatingStats } from '@/lib/types/video-ratings'

interface RatingsResponse {
  stats: VideoRatingStats | null
  walletRating: VideoRating | null
}

export function useVideoRatings(videoId: string | undefined, wallet?: string) {
  return useQuery<RatingsResponse>({
    queryKey: ['video-ratings', videoId, wallet],
    queryFn: async () => {
      const res = await fetch(`/api/videos/${videoId}/ratings`, {
        headers: wallet ? { 'x-wallet-address': wallet } : {},
      })
      if (!res.ok) throw new Error('Failed to load ratings')
      return res.json()
    },
    enabled: !!videoId,
    staleTime: 60_000,
  })
}

export function useSubmitRating(videoId: string, wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { rating: number; review?: string; watch_pct?: number }) => {
      const res = await fetch(`/api/videos/${videoId}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': wallet ?? '' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to submit rating')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['video-ratings', videoId] }),
  })
}
