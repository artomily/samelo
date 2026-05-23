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

// ── YouTube IFrame API singleton ─────────────────────────────────────────────
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: { events?: { onReady?: (e: { target: YTPlayer }) => void } },
      ) => YTPlayer
      PlayerState: { PLAYING: number }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

interface YTPlayer {
  getPlayerState(): number
  getCurrentTime(): number
  destroy(): void
}

let ytApiState: 'none' | 'loading' | 'ready' = 'none'
const ytCallbacks: Array<() => void> = []

function loadYTApi(onReady: () => void) {
  if (ytApiState === 'ready') { onReady(); return }
  ytCallbacks.push(onReady)
  if (ytApiState === 'loading') return
  ytApiState = 'loading'
  const prev = window.onYouTubeIframeAPIReady
  window.onYouTubeIframeAPIReady = () => {
    ytApiState = 'ready'
    prev?.()
    ytCallbacks.splice(0).forEach((cb) => cb())
  }
  const s = document.createElement('script')
  s.src = 'https://www.youtube.com/iframe_api'
  document.head.appendChild(s)
}

function ytSrc(url: string): string {
  try {
    // IFrame API requires youtube.com (not youtube-nocookie.com)
    const u = new URL(url.replace('youtube-nocookie.com', 'youtube.com'))
    u.searchParams.set('enablejsapi', '1')
    u.searchParams.set('origin', window.location.origin)
    return u.toString()
  } catch {
    return url
  }
}

// ── Component ────────────────────────────────────────────────────────────────
export function VideoPlayer({ video, onEarned }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const accRef = useRef(0)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // HTML5 skip detection
  const prevVidRef = useRef<number | null>(null)
  const prevWallRef = useRef<number | null>(null)

  const handleComplete = useCallback(() => {
    onEarned(video.rewardPoints)
  }, [video.rewardPoints, onEarned])

  const { progress, completed, watchedSeconds, handleTimeUpdate } = useWatchSession(video.id, {
    durationSeconds: video.durationSeconds,
    onComplete: handleComplete,
  })

  // Seconds remaining until the 80% completion threshold
  const safeDuration = video.durationSeconds > 0 ? video.durationSeconds : 300
  const targetSeconds = safeDuration * 0.8
  const remaining = Math.max(0, Math.ceil(targetSeconds - watchedSeconds))

  const isYT = isYouTubeUrl(video.videoUrl)

  // ── YouTube path: IFrame API polling ────────────────────────────────────
  useEffect(() => {
    if (!isYT) return
    accRef.current = 0
    const iframeId = `yt-${video.id}`

    let prevVideoTime: number | null = null
    let prevWallTime: number | null = null

    let playerReady = false

    function startTick() {
      if (tickRef.current) clearInterval(tickRef.current)
      tickRef.current = setInterval(() => {
        const player = playerRef.current
        if (!player || !playerReady) return
        try {
          if (player.getPlayerState() !== window.YT.PlayerState.PLAYING) {
            prevVideoTime = null
            prevWallTime = null
            return
          }
          const currentVideoTime = player.getCurrentTime()
          const now = Date.now()
          if (prevVideoTime !== null && prevWallTime !== null) {
            const videoDelta = currentVideoTime - prevVideoTime
            const wallDelta = (now - prevWallTime) / 1000
            const maxOk = Math.max(wallDelta * 2.5, 2.5)
            if (videoDelta > 0 && videoDelta <= maxOk) {
              accRef.current += videoDelta
              handleTimeUpdate(accRef.current)
            }
          }
          prevVideoTime = currentVideoTime
          prevWallTime = now
        } catch {
          // skip this tick
        }
      }, 500)
    }

    function init() {
      if (!iframeRef.current || !window.YT?.Player) return
      playerRef.current = new window.YT.Player(iframeId, {
        events: {
          onReady: (e: { target: YTPlayer }) => {
            playerRef.current = e.target
            playerReady = true
            startTick()
          },
        },
      })
    }

    loadYTApi(init)

    return () => {
      if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null }
      playerRef.current = null
      playerReady = false
    }
  }, [isYT, video.id, handleTimeUpdate])

  // Stop polling once the session is complete
  useEffect(() => {
    if (completed && tickRef.current) {
      clearInterval(tickRef.current)
      tickRef.current = null
    }
  }, [completed])

  // ── HTML5 skip-proof path ────────────────────────────────────────────────
  const handleHtml5Update = useCallback(
    (currentTime: number) => {
      const now = Date.now()
      const prevVid = prevVidRef.current
      const prevWall = prevWallRef.current
      prevVidRef.current = currentTime
      prevWallRef.current = now
      if (prevVid === null || prevWall === null) return
      const videoDelta = currentTime - prevVid
      const wallDelta = (now - prevWall) / 1000
      // Reject jumps larger than 2.5× wall-clock time (catches manual seeking)
      const maxOk = Math.max(wallDelta * 2.5, 2.5)
      if (videoDelta > 0 && videoDelta <= maxOk) {
        accRef.current += videoDelta
        handleTimeUpdate(accRef.current)
      }
    },
    [handleTimeUpdate],
  )

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black">
      {isYT ? (
        <iframe
          ref={iframeRef}
          id={`yt-${video.id}`}
          src={ytSrc(video.videoUrl)}
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
            handleHtml5Update((e.target as HTMLVideoElement).currentTime)
          }
        />
      )}

      {/* Progress overlay — top of video */}
      <div className="pointer-events-none absolute left-0 right-0 top-0">
        {completed ? (
          <div
            className="h-1.5 w-full"
            style={{ background: '#c8f135', boxShadow: '0 0 12px rgba(200,241,53,1)' }}
          />
        ) : (
          <>
            {/* Bar track */}
            <div className="h-1.5 w-full bg-black/40">
              <div
                className="relative h-full transition-all duration-500"
                style={{
                  width: `${progress * 100}%`,
                  background: 'linear-gradient(to right, rgba(200,241,53,0.6), #c8f135)',
                  boxShadow: '0 0 8px rgba(200,241,53,0.7)',
                }}
              >
                {progress > 0.02 && (
                  <span
                    className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent"
                    style={{ boxShadow: '0 0 8px rgba(200,241,53,1), 0 0 3px rgba(200,241,53,1)' }}
                  />
                )}
              </div>
            </div>
            {/* Label row */}
            <div
              className="flex items-center justify-between px-3 pb-2 pt-1"
              style={{ background: 'linear-gradient(to bottom, rgba(3,3,3,0.75) 0%, transparent 100%)' }}
            >
              <span
                className="font-display text-[10px] font-bold text-accent"
                style={{ textShadow: '0 0 6px rgba(200,241,53,0.8)' }}
              >
                {Math.round(progress * 100)}% watched
              </span>
              {remaining > 0 ? (
                <span className="text-[10px] text-white/55">
                  {remaining}s left to earn
                </span>
              ) : (
                <span
                  className="animate-pulse font-display text-[10px] font-bold text-accent"
                  style={{ textShadow: '0 0 6px rgba(200,241,53,0.8)' }}
                >
                  Almost there!
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Reward badge — shown only when complete */}
      {completed && (
        <div
          className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-accent/40 bg-bg/90 px-3 py-1 font-display text-[11px] font-bold text-accent"
          style={{ boxShadow: '0 0 12px rgba(200,241,53,0.4)' }}
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0">
            <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          +{video.rewardPoints}p earned
        </div>
      )}
    </div>
  )
}
