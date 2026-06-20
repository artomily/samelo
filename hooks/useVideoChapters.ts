import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { VideoChapterWithProgress } from '@/lib/types/video-chapters'

interface ChaptersResponse {
  chapters: VideoChapterWithProgress[]
}

export function useVideoChapters(videoId: string | undefined, wallet?: string) {
  return useQuery<ChaptersResponse>({
    queryKey: ['video-chapters', videoId, wallet],
    queryFn: async () => {
      const res = await fetch(`/api/videos/${videoId}/chapters`, {
        headers: wallet ? { 'x-wallet-address': wallet } : {},
      })
      if (!res.ok) throw new Error('Failed to load chapters')
      return res.json()
    },
    enabled: !!videoId,
    staleTime: 120_000,
  })
}

export function useUpdateChapterProgress(videoId: string, wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { chapter_id: string; watch_pct: number; completed: boolean }) => {
      const res = await fetch(`/api/videos/${videoId}/chapters/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': wallet ?? '' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to update progress')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['video-chapters', videoId, wallet] }),
  })
}
