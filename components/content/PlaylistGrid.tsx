'use client'

import { usePlaylists } from '@/hooks/usePlaylists'
import { PlaylistCard } from './PlaylistCard'

export function PlaylistGrid() {
  const { data, isLoading } = usePlaylists()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/5 animate-pulse aspect-[4/3]" />
        ))}
      </div>
    )
  }

  const playlists = data?.playlists ?? []

  if (playlists.length === 0) {
    return <p className="text-white/40 text-center py-12">No playlists yet</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {playlists.map(p => (
        <PlaylistCard
          key={p.id}
          playlist={{ ...p, videoCount: p.playlist_videos?.[0]?.count ?? 0 }}
        />
      ))}
    </div>
  )
}
