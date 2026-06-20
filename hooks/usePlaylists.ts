import { useQuery } from '@tanstack/react-query'
import type { Playlist } from '@/lib/types/playlist'

interface PlaylistsResponse {
  playlists: Array<Playlist & { playlist_videos: [{ count: number }] }>
}

async function fetchPlaylists(): Promise<PlaylistsResponse> {
  const res = await fetch('/api/playlists')
  if (!res.ok) throw new Error('Failed to fetch playlists')
  return res.json()
}

export function usePlaylists() {
  return useQuery({
    queryKey: ['playlists'],
    queryFn: fetchPlaylists,
    staleTime: 5 * 60 * 1000,
  })
}
