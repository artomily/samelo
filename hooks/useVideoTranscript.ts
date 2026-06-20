import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { TranscriptWithSegments } from '@/lib/types/video-transcripts'

export function useVideoTranscript(videoId: string, lang = 'en') {
  return useQuery({
    queryKey: ['transcript', videoId, lang],
    queryFn: async () => {
      const res = await fetch(`/api/videos/${videoId}/transcript?lang=${lang}`)
      if (res.status === 404) return null
      if (!res.ok) throw new Error('Failed to fetch transcript')
      const data = await res.json()
      return data.transcript as TranscriptWithSegments
    },
    enabled: !!videoId,
  })
}

export function useVideoTranscriptList(videoId: string) {
  return useQuery({
    queryKey: ['transcripts-all', videoId],
    queryFn: async () => {
      const res = await fetch(`/api/videos/${videoId}/transcript?all=1`)
      if (!res.ok) throw new Error('Failed to fetch transcripts')
      return res.json() as Promise<{ transcripts: TranscriptWithSegments[] }>
    },
    enabled: !!videoId,
  })
}

export function useUpsertTranscript(videoId: string, wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: {
      language?: string
      source?: string
      status?: string
      full_text?: string
      segments?: unknown[]
    }) => {
      const res = await fetch(`/api/videos/${videoId}/transcript`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to upsert transcript')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transcript', videoId] })
      qc.invalidateQueries({ queryKey: ['transcripts-all', videoId] })
    },
  })
}
