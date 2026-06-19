'use client'

import { useTrendingVideos } from '@/hooks/useTrendingVideos'
import { VideoCard } from './VideoCard'
import type { Video } from '@/lib/types/video'

interface TrendingSectionProps {
  onWatch?: (video: Video) => void
  watchedIds?: Set<string>
}

export function TrendingSection({ onWatch, watchedIds }: TrendingSectionProps) {
  const { data, isLoading } = useTrendingVideos()

  if (isLoading) return (
    <div className="space-y-3">
      <div className="h-5 w-32 bg-white/5 rounded animate-pulse" />
      <div className="flex gap-3 overflow-x-auto pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-48 aspect-video flex-shrink-0 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )

  if (!data?.videos.length) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">🔥</span>
        <h2 className="text-sm font-semibold text-white/70">Trending This Week</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
        {data.videos.map(video => (
          <div key={video.id} className="w-56 flex-shrink-0 snap-start">
            <VideoCard video={video} onWatch={onWatch} watched={watchedIds?.has(video.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}
