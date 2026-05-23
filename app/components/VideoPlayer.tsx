'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useWatchSession } from '@/hooks/useWatchSession'
import type { Video } from '@/lib/mock-videos'

interface VideoPlayerProps {
  video: Video
  onEarned: (rewardCents: number) => void
}

function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

export function VideoPlayer({ video, onEarned }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const elapsedRef = useRef(0)

  const handleComplete = useCallback(() => {
    onEarned(video.rewardPoints)
  }, [video.rewardPoints, onEarned])

  const { progress, completed, handleTimeUpdate } = useWatchSession(video.id, {
    durationSeconds: video.durationSeconds,
    onComplete: handleComplete,
  })

  const isYT = isYouTubeUrl(video.videoUrl)

  // For YouTube iframes: simulate time progress with a 1-second interval
  // while the iframe is mounted (user is on the player).
  useEffect(() => {
    if (!isYT) return
    elapsedRef.current = 0

    timerRef.current = setInterval(() => {
      elapsedRef.current += 1
      handleTimeUpdate(elapsedRef.current)
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isYT, video.id, handleTimeUpdate])

  // Stop the timer once completed
  useEffect(() => {
    if (completed && timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [completed])

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black">
      {isYT ? (
        <iframe
          src={video.videoUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full border-0"
        />
      ) : (
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
      )}

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
