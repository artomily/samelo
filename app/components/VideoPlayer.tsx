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
    const u = new URL(url)
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

  const { progress, completed, handleTimeUpdate } = useWatchSession(video.id, {
    durationSeconds: video.durationSeconds,
    onComplete: handleComplete,
  })

  const isYT = isYouTubeUrl(video.videoUrl)

  // ── YouTube path: IFrame API polling ────────────────────────────────────
  useEffect(() => {
    if (!isYT) return
    accRef.current = 0
    const iframeId = `yt-${video.id}`

    function startTick(player: YTPlayer) {
      if (tickRef.current) clearInterval(tickRef.current)
      tickRef.current = setInterval(() => {
        // Only count seconds when the player reports state=1 (PLAYING)
        if (player.getPlayerState() === 1) {
          accRef.current += 1
          handleTimeUpdate(accRef.current)
        }
      }, 1000)
    }

    function init() {
      const el = iframeRef.current
      if (!el || !window.YT?.Player) return
      el.id = iframeId
      const p = new window.YT.Player(iframeId, {
        events: {
          onReady: (e) => {
            playerRef.current = e.target
            startTick(e.target)
          },
        },
      })
      playerRef.current = p
    }

    loadYTApi(init)

    return () => {
      if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null }
      try { playerRef.current?.destroy() } catch { /* ignore */ }
      playerRef.current = null
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
