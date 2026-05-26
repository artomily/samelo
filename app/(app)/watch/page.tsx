'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useVideos } from '@/hooks/useVideos'
import { useState, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Skeleton } from '@/app/components/Skeleton'
import { toast } from '@/app/components/Toast'

const VideoPlayer = dynamic(
  () => import('@/app/components/VideoPlayer').then((m) => ({ default: m.VideoPlayer })),
  { ssr: false, loading: () => <Skeleton className="aspect-video w-full rounded-xl" /> },
)

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function WatchPage() {
  const { address } = useAccount()
  const { videos, loading } = useVideos()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set())

  const selectedIdx = selectedId ? videos.findIndex((v) => v.id === selectedId) : -1
  const selected = selectedIdx >= 0 ? videos[selectedIdx] : null
  const hasNext = selectedIdx >= 0 && selectedIdx < videos.length - 1
  const hasPrev = selectedIdx > 0

  // Pre-load already-watched video IDs so "Earned ✓" shows on page refresh
  useEffect(() => {
    if (!address) {
      setEarnedIds(new Set())
      return
    }
    fetch(`/api/watch/history?walletAddress=${address}`)
      .then((r) => r.json())
      .then((d: { videoIds?: string[] }) => {
        if (d.videoIds && d.videoIds.length > 0) {
          setEarnedIds(new Set(d.videoIds))
        }
      })
      .catch(() => {})
  }, [address])

  const goNext = useCallback(() => {
    if (hasNext) setSelectedId(videos[selectedIdx + 1]!.id)
  }, [hasNext, selectedIdx, videos])

  const goPrev = useCallback(() => {
    if (hasPrev) setSelectedId(videos[selectedIdx - 1]!.id)
  }, [hasPrev, selectedIdx, videos])

  const handleEarned = useCallback(async (rewardPoints: number) => {
    if (!selectedId || earnedIds.has(selectedId)) return
    setEarnedIds((prev) => new Set(prev).add(selectedId))
    toast(`+${rewardPoints} points earned!`, 'success')

    if (!address) return
    try {
      await fetch('/api/watch/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: selectedId, walletAddress: address }),
      })
    } catch {
      // non-fatal
    }
  }, [selectedId, earnedIds, address])

  return (
    <div className="flex min-h-dvh flex-col bg-[#030303]">
      {/* Header */}
      <header
        className="sticky top-0 left-0 right-0 z-30 flex items-center justify-between border-b border-[rgba(200,241,53,0.10)] px-4 py-3 sm:px-7 sm:py-3.5"
        style={{ background: 'rgba(3,3,3,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <div className="min-w-0 flex-1 mr-3">
          <p
            className="font-display text-[13px] font-black uppercase tracking-[0.15em] text-primary"
            style={{ textShadow: '0 0 10px rgba(200,241,53,0.2)' }}
          >
            Watch &amp; Earn
          </p>
          <p className="mt-0.5 truncate text-[11px] text-muted">{loading ? '...' : `${videos.length} videos available`}</p>
        </div>
        <Link
          href="/home"
          className="btn-neon inline-flex shrink-0 items-center justify-center px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest"
        >
          Close
        </Link>
      </header>

      {/* Main content */}
      <div className="w-full overflow-hidden px-4 py-4 pb-20 sm:px-7 sm:py-5">
        <div className="grid gap-3 md:grid-cols-[1fr_300px] sm:gap-3.5">
          {/* LEFT: Selected video or empty state */}
          <div className="min-w-0">
            {selected ? (
              <div className="glass-card overflow-hidden p-3 space-y-3 sm:p-4 sm:space-y-4">
                {/* Video counter */}
                <div className="flex items-center justify-between text-[10px] text-muted border-b border-[rgba(200,241,53,0.08)] pb-2 sm:pb-3">
                  <span className="font-display font-bold text-accent">Video {selectedIdx + 1} of {videos.length}</span>
                  <span className="font-mono text-[9px] opacity-60">ID: {selectedId}</span>
                </div>

                {/* Video Player */}
                <VideoPlayer key={selectedId!} video={selected} earned={earnedIds.has(selectedId!)} onEarned={handleEarned} />

                {/* Info */}
                <div>
                  <h2 className="truncate text-xs font-bold text-primary mb-0.5 sm:text-sm">{selected.title}</h2>
                  <p className="text-[10px] text-muted sm:text-[11px]">{selected.sponsor} · {formatDuration(selected.durationSeconds)}</p>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                  <button
                    onClick={goPrev}
                    disabled={!hasPrev}
                    className="flex-1 rounded-lg border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.06)] px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-accent transition-all sm:px-3 sm:py-2.5 sm:text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:border-[rgba(200,241,53,0.4)]"
                  >
                    &larr; Prev
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!hasNext}
                    className="flex-1 rounded-lg border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.06)] px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-accent transition-all sm:px-3 sm:py-2.5 sm:text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:border-[rgba(200,241,53,0.4)]"
                  >
                    Next &rarr;
                  </button>
                </div>

                <div className="text-[10px] text-muted text-center pt-2 border-t border-[rgba(200,241,53,0.08)] sm:text-[11px]">
                  Watch to earn {selected.rewardPoints} points
                </div>
              </div>
            ) : (
              <div className="glass-card overflow-hidden p-6 text-center space-y-3 sm:p-8">
                <p className="text-muted text-sm">Select a video to begin</p>
              </div>
            )}
          </div>

          {/* RIGHT: Video list */}
          <div className="glass-card overflow-hidden p-3 h-fit sm:p-4">
            <p className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-primary" style={{ textShadow: '0 0 8px rgba(200,241,53,0.2)' }}>
              Queue
            </p>

            <div className="flex flex-col gap-1.5 sm:gap-2">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-2 p-2">
                      <Skeleton className="h-8 w-full rounded" />
                      <Skeleton className="h-3 w-2/3 rounded" />
                    </div>
                  ))
                : videos.map((video, idx) => (
                    <button
                      key={video.id}
                      onClick={() => setSelectedId(video.id)}
                      className={[
                        'text-left rounded-lg p-2 transition-all text-[10px] sm:p-2.5',
                        selectedId === video.id
                          ? 'border border-[rgba(200,241,53,0.35)] bg-[rgba(200,241,53,0.08)] shadow-[0_0_12px_rgba(200,241,53,0.15)]'
                          : 'border border-[rgba(200,241,53,0.1)] hover:border-[rgba(200,241,53,0.2)]'
                      ].join(' ')}
                    >
                      <p className="font-bold text-primary truncate text-[11px] sm:text-[12px]">{idx + 1}. {video.title}</p>
                      <p className="text-muted mt-0.5 truncate text-[10px]">{video.sponsor} · {formatDuration(video.durationSeconds)}</p>
                      <p className="text-accent font-display font-bold mt-1 text-[10px] sm:text-[11px]">+{video.rewardPoints}p</p>
                    </button>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
