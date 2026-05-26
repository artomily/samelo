'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
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
  const [watchPercent, setWatchPercent] = useState(0)
  const [watchComplete, setWatchComplete] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const ytReadyRef = useRef(false)
  const ytDurationRef = useRef(0)

  const isYT = isYouTubeUrl(video.videoUrl)
  const showClaim = watchComplete && !earned

  // ── YouTube watch tracking via postMessage ──────────────────────────────
  useEffect(() => {
    if (!isYT) return

    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'string') return
      try {
        const data = JSON.parse(e.data)
        if (data.event === 'onReady') {
          ytReadyRef.current = true
        }
        if (data.event === 'onStateChange' && data.info) {
          if (data.info === 0) {
            // Ended
            setWatchPercent(100)
            setWatchComplete(true)
          }
        }
      } catch {
        // not JSON or wrong format — ignore
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [isYT, video.id])

  // ── YouTube: fallback timer-based tracking ──────────────────────────────
  useEffect(() => {
    if (!isYT || !video.durationSeconds || video.durationSeconds <= 0) return

    if (earned || watchComplete) return

    const totalMs = video.durationSeconds * 1000
    const interval = 500
    const start = Date.now()

    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100))
      setWatchPercent(pct)
      if (pct >= 95) {
        setWatchComplete(true)
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isYT, video.id, video.durationSeconds, earned, watchComplete])

  // ── Native video watch tracking ─────────────────────────────────────────
  useEffect(() => {
    if (isYT) return
    const el = videoRef.current
    if (!el) return

    const handleTimeUpdate = () => {
      if (el.duration <= 0) return
      const pct = Math.round((el.currentTime / el.duration) * 100)
      setWatchPercent(pct)
      if (pct >= 95) setWatchComplete(true)
    }

    const handleEnded = () => {
      setWatchPercent(100)
      setWatchComplete(true)
    }

    el.addEventListener('timeupdate', handleTimeUpdate)
    el.addEventListener('ended', handleEnded)
    return () => {
      el.removeEventListener('timeupdate', handleTimeUpdate)
      el.removeEventListener('ended', handleEnded)
    }
  }, [isYT, video.id])

  // Reset on video change
  useEffect(() => {
    setWatchPercent(0)
    setWatchComplete(false)
    ytReadyRef.current = false
    ytDurationRef.current = 0
  }, [video.id])

  const handleClaim = useCallback(() => {
    if (earned || claiming || !watchComplete) return
    setClaiming(true)
    onEarned(video.rewardPoints)
  }, [earned, claiming, watchComplete, video.rewardPoints, onEarned])

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-black">
      <div className="relative w-full">
        {isYT ? (
          <iframe
            key={video.id}
            src={ytSrc(video.videoUrl)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full border-0"
          />
        ) : (
          <video
            key={video.id}
            ref={videoRef}
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
          <div className="space-y-2.5">
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
            <Link
              href={`/quiz/${encodeURIComponent(video.id)}`}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(200,241,53,0.25)] bg-[rgba(200,241,53,0.06)] py-2 text-[11px] font-bold uppercase tracking-wider text-accent transition-all hover:border-[rgba(200,241,53,0.45)]"
            >
              Take Quiz for Bonus Points &rarr;
            </Link>
          </div>
        ) : (
          <>
            {/* Watch progress bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-[9px] text-muted mb-1">
                <span className="font-display uppercase tracking-widest">Watch to claim</span>
                <span className="font-mono">{watchPercent}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[rgba(255,255,255,0.08)]">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${watchPercent}%`,
                    background: watchComplete
                      ? '#c8f135'
                      : 'linear-gradient(90deg, rgba(200,241,53,0.5), rgba(200,241,53,0.8))',
                    boxShadow: watchComplete ? '0 0 8px rgba(200,241,53,0.6)' : 'none',
                  }}
                />
              </div>
            </div>

            {showClaim ? (
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="w-full rounded-lg border border-[rgba(200,241,53,0.3)] bg-[rgba(200,241,53,0.08)] py-2 font-display text-[12px] font-bold uppercase tracking-wider text-accent transition-all hover:border-[rgba(200,241,53,0.5)] hover:bg-[rgba(200,241,53,0.14)] disabled:opacity-40 animate-pulse"
                style={{ boxShadow: '0 0 16px rgba(200,241,53,0.2)' }}
              >
                {claiming ? 'Claiming…' : `Claim +${video.rewardPoints} pts`}
              </button>
            ) : (
              <button
                disabled
                className="w-full rounded-lg border border-[rgba(200,241,53,0.08)] bg-[rgba(200,241,53,0.02)] py-2 font-display text-[11px] uppercase tracking-wider text-muted/40 cursor-not-allowed"
              >
                Watch {100 - watchPercent}% more to claim
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
