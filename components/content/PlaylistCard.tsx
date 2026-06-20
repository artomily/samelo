'use client'

import Link from 'next/link'
import type { Playlist } from '@/lib/types/playlist'

interface Props {
  playlist: Playlist & { videoCount?: number }
}

export function PlaylistCard({ playlist }: Props) {
  return (
    <Link href={`/playlists/${playlist.slug}`} className="group block rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:border-[#c8f135]/40 transition-colors">
      <div className="relative aspect-video bg-white/5">
        {playlist.thumbnailUrl ? (
          <img src={playlist.thumbnailUrl} alt={playlist.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">▶</div>
        )}
        {playlist.isFeatured && (
          <span className="absolute top-2 left-2 bg-[#c8f135] text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Featured
          </span>
        )}
        <span className="absolute bottom-2 right-2 bg-black/70 text-white/80 text-xs px-2 py-0.5 rounded">
          {playlist.videoCount ?? 0} videos
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white group-hover:text-[#c8f135] transition-colors line-clamp-1">
          {playlist.title}
        </h3>
        {playlist.description && (
          <p className="text-white/50 text-sm mt-1 line-clamp-2">{playlist.description}</p>
        )}
      </div>
    </Link>
  )
}
