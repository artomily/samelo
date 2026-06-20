import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { PlaylistV2 } from '@/lib/types/playlist-v2'

export function useFeaturedPlaylists() {
  return useQuery<{ playlists: PlaylistV2[] }>({
    queryKey: ['playlists', 'featured'],
    queryFn: async () => {
      const res = await fetch('/api/playlists/featured')
      if (!res.ok) throw new Error('Failed to load featured playlists')
      return res.json()
    },
    staleTime: 5 * 60_000,
  })
}

export function usePlaylistsByTag(tag: string | undefined) {
  return useQuery<{ playlists: PlaylistV2[]; tag: string }>({
    queryKey: ['playlists', 'tag', tag],
    queryFn: async () => {
      const res = await fetch(`/api/playlists/tag/${tag}`)
      if (!res.ok) throw new Error('Failed to load playlists')
      return res.json()
    },
    enabled: !!tag && tag.length >= 2,
    staleTime: 60_000,
  })
}

export function usePlaylistLike(wallet: string | undefined, playlistId: string) {
  const qc = useQueryClient()

  const likeState = useQuery<{ liked: boolean }>({
    queryKey: ['playlist-like', wallet, playlistId],
    queryFn: async () => {
      const res = await fetch(`/api/playlists/${playlistId}/like`, {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })

  const toggle = useMutation<void, Error, boolean>({
    mutationFn: async (isLiked) => {
      const method = isLiked ? 'DELETE' : 'POST'
      await fetch(`/api/playlists/${playlistId}/like`, {
        method,
        headers: { 'x-wallet-address': wallet ?? '' },
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['playlist-like', wallet, playlistId] })
    },
  })

  return { likeState, toggle }
}
