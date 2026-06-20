'use client'

import { usePlaylist } from '@/hooks/usePlaylist'
import Link from 'next/link'

interface Props {
  slug: string
}

export function PlaylistDetail({ slug }: Props) {
  const { data, isLoading } = usePlaylist(slug)

  if (isLoading) {
    return <div className="space-y-4 animate-pulse">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/5" />)}</div>
  }

  if (!data?.playlist) {
    return <p className="text-white/40 text-center py-12">Playlist not found</p>
  }

  const { playlist } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">{playlist.title}</h1>
        {playlist.description && <p className="text-white/60 mt-2">{playlist.description}</p>}
        <p className="text-white/40 text-sm mt-1">{playlist.videos.length} videos</p>
      </div>
      <div className="space-y-3">
        {playlist.videos.map((video, idx) => (
          <Link
            key={video.id}
            href={`/watch/${video.id}`}
            className="flex items-center gap-4 p-3 rounded-xl border border-white/10 bg-white/5 hover:border-[#c8f135]/40 transition-colors group"
          >
            <span className="text-white/30 text-sm w-6 text-center">{idx + 1}</span>
            <div className="w-24 aspect-video rounded bg-white/10 flex-shrink-0 overflow-hidden">
              {video.thumbnailUrl && <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white group-hover:text-[#c8f135] font-medium truncate transition-colors">{video.title}</p>
              <p className="text-white/40 text-xs mt-0.5">+{video.rewardCents / 100} pts</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
