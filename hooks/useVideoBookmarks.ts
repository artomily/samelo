import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { VideoBookmark } from '@/lib/types/video-bookmarks'

export function useVideoBookmarks(wallet?: string) {
  return useQuery({
    queryKey: ['bookmarks', wallet],
    queryFn: async () => {
      const res = await fetch('/api/bookmarks', {
        headers: { 'x-wallet-address': wallet! },
      })
      if (!res.ok) throw new Error('Failed to fetch bookmarks')
      return res.json() as Promise<{ bookmarks: VideoBookmark[] }>
    },
    enabled: !!wallet,
  })
}

export function useAddBookmark(wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: {
      video_id: string
      timestamp_ms?: number
      note?: string
      is_private?: boolean
    }) => {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to add bookmark')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookmarks', wallet] }),
  })
}

export function useRemoveBookmark(wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify({ id }),
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookmarks', wallet] }),
  })
}
