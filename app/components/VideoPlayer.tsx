'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
  const debugReadyState = useState(false)
  const debugGenState = useState(0)
  const [debugReady, setDebugReady] = debugReadyState
  const [debugGen, setDebugGen] = debugGenState

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
    let playerGen = 0
    setDebugReady(false)
    setDebugGen(0)

    function startTick() {
      if (tickRef.current) clearInterval(tickRef.current)
      tickRef.current = setInterval(() => {
        const player = playerRef.current
        if (!player || !playerReady) return
        try {
          const state = player.getPlayerState()
          // state === 1 means YT.PlayerState.PLAYING
          if (state !== 1) {
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
      const gen = ++playerGen
      setDebugGen(gen)
      playerRef.current = new window.YT.Player(iframeId, {
        events: {
          onReady: (e: { target: YTPlayer }) => {
            if (gen !== playerGen) return // stale callback from React Strict Mode
            playerRef.current = e.target
            playerReady = true
            setDebugReady(true)
            startTick()
          },
        },
      })

      // Fallback: if onReady doesn't fire within 5s, force-start anyway
      setTimeout(() => {
        if (gen === playerGen && !playerReady) {
          playerReady = true
          setDebugReady(true)
          startTick()
        }
      }, 5000)
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
    <div className="w-full overflow-hidden rounded-2xl bg-black">
      <div className="relative w-full">
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

      {/* Progress bar — below video */}
      <div className="px-3 pb-3 pt-2">
        {completed ? (
          <div className="flex items-center gap-3">
            <div
              className="h-2 flex-1 rounded-full"
              style={{ background: '#c8f135', boxShadow: '0 0 12px rgba(200,241,53,1)' }}
            />
            <span
              className="shrink-0 font-display text-[11px] font-bold text-accent"
              style={{ textShadow: '0 0 6px rgba(200,241,53,0.8)' }}
            >
              100% watched
            </span>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(progress * 100, 2)}%`,
                  background: 'linear-gradient(to right, rgba(200,241,53,0.6), #c8f135)',
                  boxShadow: '0 0 8px rgba(200,241,53,0.6)',
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-display text-[11px] font-bold text-accent/80">
                {Math.round(progress * 100)}% watched
              </span>
              {remaining > 0 ? (
                <span className="text-[11px] text-white/40">
                  ~{remaining}s to earn
                </span>
              ) : (
                <span className="animate-pulse font-display text-[11px] font-bold text-accent">
                  Keep watching…
                </span>
              )}
            </div>
            <div className="text-[9px] text-muted/30 tabular-nums">
              debug: {watchedSeconds.toFixed(1)}s / {safeDuration}s &middot; ready:{String(debugReady)} &middot; gen:{debugGen}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
