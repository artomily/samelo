'use client'

import Image from 'next/image'
import type { Video } from '@/lib/mock-videos'

/**
 * VideoCard - Displays a single video with thumbnail, title, and reward amount
 * Used in the feed content and video selection interface
 */
interface VideoCardProps {
  video: Video
  isActive: boolean
  onSelect: (id: string) => void
}

export function VideoCard({ video, isActive, onSelect }: VideoCardProps) {
  return (
    <button
      onClick={() => onSelect(video.id)}
      className="glass-card w-full overflow-hidden text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(200,241,53,0.3)]"
      style={isActive ? { borderColor: 'rgba(200,241,53,0.35)', boxShadow: '0 0 20px rgba(200,241,53,0.08)' } : {}}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 640px"
          unoptimized
        />
        {/* Scan line */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        {/* Earn badge */}
        <div
          className="absolute bottom-2 right-2 rounded-full border border-[rgba(200,241,53,0.3)] bg-black/80 px-2.5 py-1 font-display text-[11px] font-bold text-accent backdrop-blur-sm"
          style={{ boxShadow: '0 0 8px rgba(200,241,53,0.25)' }}
        >
          +{video.rewardPoints}p
        </div>
      </div>

      {/* Meta */}
      <div className="px-3 py-2.5">
        <p className="line-clamp-1 text-sm font-semibold leading-snug text-primary">{video.title}</p>
        <p className="mt-0.5 text-xs text-muted">{video.sponsor}</p>
      </div>
    </button>
  )
}
