'use client'

import type { Video } from '@/lib/types/video'
import { DifficultyBadge } from './DifficultyBadge'
import { formatCompact } from '@/lib/format-number'

interface VideoCardProps {
  video: Video
  onWatch?: (video: Video) => void
  watched?: boolean
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return ''
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function VideoCard({ video, onWatch, watched }: VideoCardProps) {
  const thumb = video.thumbnailUrl ?? `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-[#c8f135]/30 transition-all group">
      <div className="relative aspect-video">
        <img src={thumb} alt={video.title} className="w-full h-full object-cover" />
        {video.durationSeconds && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
            {formatDuration(video.durationSeconds)}
          </span>
        )}
        {video.isFeatured && (
          <span className="absolute top-2 left-2 bg-[#c8f135] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
            FEATURED
          </span>
        )}
      </div>
      <div className="p-3 space-y-2">
        <p className="text-sm font-medium text-white leading-snug line-clamp-2">{video.title}</p>
        <div className="flex items-center justify-between">
          <DifficultyBadge difficulty={video.difficulty} />
          <span className="text-[10px] text-white/40">{formatCompact(video.watchCount)} watches</span>
        </div>
        <button
          onClick={() => onWatch?.(video)}
          disabled={watched}
          className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-all ${
            watched
              ? 'bg-[#35d07f]/20 text-[#35d07f] cursor-default'
              : 'bg-[#c8f135] text-black hover:bg-[#d4f557]'
          }`}
        >
          {watched ? `✓ Earned ${video.rewardCents} pts` : `▶ Watch · +${video.rewardCents} pts`}
        </button>
      </div>
    </div>
  )
}
