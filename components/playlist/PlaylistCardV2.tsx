'use client'

import Link from 'next/link'
import type { PlaylistV2 } from '@/lib/types/playlist-v2'
import { PlaylistTagBadge } from './PlaylistTagBadge'

interface Props {
  playlist: PlaylistV2
  onTagClick?: (tag: string) => void
}

export function PlaylistCardV2({ playlist, onTagClick }: Props) {
  return (
    <Link
      href={`/playlists/${playlist.id}`}
      className="block rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-all"
    >
      {playlist.cover_url ? (
        <img
          src={playlist.cover_url}
          alt={playlist.title}
          className="w-full h-32 object-cover"
        />
      ) : (
        <div
          className="w-full h-32 flex items-center justify-center"
          style={{ background: '#c8f13515' }}
        >
          <span className="text-3xl">📋</span>
        </div>
      )}

      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold line-clamp-2">{playlist.title}</p>
          {playlist.featured && (
            <span className="shrink-0 text-xs px-1.5 py-0.5 rounded" style={{ background: '#c8f135', color: '#030303' }}>
              Featured
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-white/40">
          <span>{playlist.view_count.toLocaleString()} views</span>
        </div>

        {playlist.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {playlist.tags.slice(0, 3).map((tag) => (
              <PlaylistTagBadge
                key={tag}
                tag={tag}
                onClick={(t) => { onTagClick?.(t) }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
