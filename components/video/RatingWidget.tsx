'use client'

import { useState } from 'react'
import { useSubmitRating } from '@/hooks/useVideoRatings'
import { starLabel, renderStars, ratingColor } from '@/lib/types/video-ratings'
import type { VideoRatingStats } from '@/lib/types/video-ratings'

interface Props {
  videoId: string
  wallet: string | undefined
  stats: VideoRatingStats | null
  currentRating: number | null
}

export function RatingWidget({ videoId, wallet, stats, currentRating }: Props) {
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(currentRating ?? 0)
  const submitRating = useSubmitRating(videoId, wallet)

  const displayRating = hovered || selected

  return (
    <div className="space-y-2">
      {stats && (
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold" style={{ color: ratingColor(stats.avg_rating) }}>
            {stats.avg_rating.toFixed(1)}
          </span>
          <span className="text-sm" style={{ color: ratingColor(stats.avg_rating) }}>
            {renderStars(stats.avg_rating)}
          </span>
          <span className="text-xs text-[#555]">({stats.rating_count})</span>
        </div>
      )}
      {wallet && (
        <div className="space-y-1">
          <p className="text-xs text-[#555]">{currentRating ? 'Your rating:' : 'Rate this video:'}</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => {
                  setSelected(star)
                  submitRating.mutate({ rating: star })
                }}
                className="text-2xl transition-colors leading-none"
                style={{ color: star <= displayRating ? ratingColor(displayRating) : '#333' }}
              >
                ★
              </button>
            ))}
          </div>
          {displayRating > 0 && <p className="text-xs text-[#888]">{starLabel(displayRating)}</p>}
        </div>
      )}
    </div>
  )
}
