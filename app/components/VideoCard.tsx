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
      className={`w-full overflow-hidden rounded-2xl border text-left transition-all ${
        isActive
          ? 'border-accent bg-card'
          : 'border-border bg-card hover:border-accent/50'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 640px"
          unoptimized
        />
        {/* Earn badge */}
        <div className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-accent backdrop-blur-sm">
          +${(video.rewardCents / 100).toFixed(2)}
        </div>
      </div>

      {/* Meta */}
      <div className="px-3 py-2.5">
        <p className="line-clamp-1 text-sm font-semibold leading-snug">
          {video.title}
        </p>
        <p className="mt-0.5 text-xs text-muted">{video.sponsor}</p>
      </div>
    </button>
  )
}
