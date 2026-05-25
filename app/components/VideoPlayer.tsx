'use client'

import { useCallback, useState } from 'react'
import type { Video } from '@/lib/mock-videos'

interface VideoPlayerProps {
  video: Video
  earned?: boolean
  onEarned: (rewardCents: number) => void
}

function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

function ytSrc(url: string): string {
  try {
    const u = new URL(url.replace('youtube-nocookie.com', 'youtube.com'))
    u.searchParams.set('enablejsapi', '1')
    u.searchParams.set('origin', window.location.origin)
    return u.toString()
  } catch {
    return url
  }
}

export function VideoPlayer({ video, earned = false, onEarned }: VideoPlayerProps) {
  const [claiming, setClaiming] = useState(false)
  const isYT = isYouTubeUrl(video.videoUrl)

  const handleClaim = useCallback(() => {
    if (earned || claiming) return
    setClaiming(true)
    onEarned(video.rewardPoints)
  }, [earned, claiming, video.rewardPoints, onEarned])

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-black">
      <div className="relative w-full">
        {isYT ? (
          <iframe
            id={`yt-${video.id}`}
            src={ytSrc(video.videoUrl)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full border-0"
          />
        ) : (
          <video
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full object-cover"
          />
        )}

        {earned && (
          <div
            className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-accent/40 bg-bg/90 px-3 py-1 font-display text-[11px] font-bold text-accent"
            style={{ boxShadow: '0 0 12px rgba(200,241,53,0.4)' }}
          >
            <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0">
              <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            Earned ✓
          </div>
        )}
      </div>

      <div className="px-3 pb-3 pt-2">
        {earned ? (
          <div className="flex items-center gap-3">
            <div
              className="h-2 flex-1 rounded-full"
              style={{ background: '#c8f135', boxShadow: '0 0 12px rgba(200,241,53,1)' }}
            />
            <span
              className="shrink-0 font-display text-[11px] font-bold text-accent"
              style={{ textShadow: '0 0 6px rgba(200,241,53,0.8)' }}
            >
              Rewards claimed
            </span>
          </div>
        ) : (
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="w-full rounded-lg border border-[rgba(200,241,53,0.3)] bg-[rgba(200,241,53,0.08)] py-2 font-display text-[12px] font-bold uppercase tracking-wider text-accent transition-all hover:border-[rgba(200,241,53,0.5)] hover:bg-[rgba(200,241,53,0.14)] disabled:opacity-40"
          >
            {claiming ? 'Claiming…' : `Claim +${video.rewardPoints} pts`}
          </button>
        )}
      </div>
    </div>
  )
}
