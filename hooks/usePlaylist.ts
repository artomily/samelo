import { useQuery } from '@tanstack/react-query'
import type { PlaylistWithVideos } from '@/lib/types/playlist'

async function fetchPlaylist(slug: string): Promise<{ playlist: PlaylistWithVideos }> {
  const res = await fetch(`/api/playlists/${slug}`)
  if (!res.ok) throw new Error('Playlist not found')
  return res.json()
}

export function usePlaylist(slug: string) {
  return useQuery({
    queryKey: ['playlist', slug],
    queryFn: () => fetchPlaylist(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  })
}
