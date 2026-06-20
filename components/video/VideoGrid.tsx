'use client'

import { useState } from 'react'
import { useVideosByCategory } from '@/hooks/useVideosByCategory'
import { VideoCard } from './VideoCard'
import { CategoryPill } from './CategoryPill'
import type { VideoCategory, VideoDifficulty, Video } from '@/lib/types/video'
import { VIDEO_CATEGORIES } from '@/lib/types/video'

interface VideoGridProps {
  onWatch?: (video: Video) => void
  watchedIds?: Set<string>
}

const DIFFICULTIES: VideoDifficulty[] = ['beginner', 'intermediate', 'advanced']

export function VideoGrid({ onWatch, watchedIds }: VideoGridProps) {
  const [category, setCategory] = useState<VideoCategory | undefined>()
  const [difficulty, setDifficulty] = useState<VideoDifficulty | undefined>()
  const { data, isLoading } = useVideosByCategory({ category, difficulty })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <CategoryPill
          category="general"
          active={!category}
          onClick={() => setCategory(undefined)}
        />
        {VIDEO_CATEGORIES.filter(c => c !== 'general').map(c => (
          <CategoryPill key={c} category={c} active={category === c} onClick={() => setCategory(c)} />
        ))}
      </div>

      <div className="flex gap-2">
        {([undefined, ...DIFFICULTIES] as const).map(d => (
          <button
            key={d ?? 'all'}
            onClick={() => setDifficulty(d)}
            className={`text-xs px-2.5 py-1 rounded-full transition-all ${
              difficulty === d ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            {d ?? 'All levels'}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-video rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(data?.videos ?? []).map(video => (
          <VideoCard
            key={video.id}
            video={video}
            onWatch={onWatch}
            watched={watchedIds?.has(video.id)}
          />
        ))}
      </div>
    </div>
  )
}
