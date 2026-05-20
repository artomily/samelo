'use client'

import { useCallback, useRef } from 'react'
import { useWatchSession } from '@/hooks/useWatchSession'
import type { Video } from '@/lib/mock-videos'

/**
 * VideoPlayer - Plays individual videos and tracks watch progress
 * Monitors completion time to determine earned rewards
 * Supports custom completion callback for reward distribution
 */
interface VideoPlayerProps {
  video: Video
  onEarned: (rewardCents: number) => void
}

export function VideoPlayer({ video, onEarned }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleComplete = useCallback(() => {
    onEarned(video.rewardCents)
  }, [video.rewardCents, onEarned])

  const { progress, completed, handleTimeUpdate } = useWatchSession(video.id, {
    durationSeconds: video.durationSeconds,
    onComplete: handleComplete,
  })

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black">
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        controls
        playsInline
        preload="metadata"
        className="aspect-video w-full object-cover"
        onTimeUpdate={(e) =>
          handleTimeUpdate((e.target as HTMLVideoElement).currentTime)
        }
      />

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Completion badge */}
      {completed && (
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-bg">
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
          Earned!
        </div>
      )}
    </div>
  )
}
