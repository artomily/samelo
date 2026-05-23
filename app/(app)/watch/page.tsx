'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useVideos } from '@/hooks/useVideos'
import { useState, useCallback } from 'react'
import { Skeleton } from '@/app/components/Skeleton'

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function WatchPage() {
  const { videos, loading } = useVideos()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedIdx = selectedId ? videos.findIndex((v) => v.id === selectedId) : -1
  const selected = selectedIdx >= 0 ? videos[selectedIdx] : null
  const hasNext = selectedIdx >= 0 && selectedIdx < videos.length - 1
  const hasPrev = selectedIdx > 0

  const goNext = useCallback(() => {
    if (hasNext) setSelectedId(videos[selectedIdx + 1]!.id)
  }, [hasNext, selectedIdx, videos])

  const goPrev = useCallback(() => {
    if (hasPrev) setSelectedId(videos[selectedIdx - 1]!.id)
  }, [hasPrev, selectedIdx, videos])

  return (
    <div className="flex min-h-dvh flex-col bg-[#030303]">
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(200,241,53,0.10)] px-4 py-3"
        style={{ background: 'rgba(3,3,3,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <div>
          <p
            className="font-display text-[13px] font-black uppercase tracking-[0.15em] text-primary"
            style={{ textShadow: '0 0 10px rgba(200,241,53,0.2)' }}
          >
            Watch &amp; Earn
          </p>
          <p className="mt-0.5 text-[11px] text-muted">{loading ? '...' : `${videos.length} videos available`}</p>
        </div>
        <Link
          href="/home"
          className="btn-neon inline-flex items-center justify-center px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest"
        >
          Close
        </Link>
      </header>

      {/* Main content */}
      <div className="grid gap-4 px-4 py-4 pb-28 md:grid-cols-[1fr_320px] sm:gap-5 sm:px-7">
        {/* LEFT: Selected video or empty state */}
        <div>
          {selected ? (
            <div className="glass-card p-4 space-y-4">
              {/* Video counter */}
              <div className="flex items-center justify-between text-[10px] text-muted border-b border-[rgba(200,241,53,0.08)] pb-3">
                <span className="font-display font-bold text-accent">Video {selectedIdx + 1} of {videos.length}</span>
                <span className="font-mono text-[9px] opacity-60">ID: {selectedId}</span>
              </div>

              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                <Image
                  src={selected.thumbnailUrl}
                  alt={selected.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {/* Reward badge */}
                <span
                  className="absolute right-3 top-3 rounded-md border border-[rgba(200,241,53,0.4)] bg-[rgba(3,3,3,0.85)] px-2 py-0.5 font-display text-[10px] font-bold text-accent"
                  style={{ textShadow: '0 0 8px rgba(200,241,53,0.6)' }}
                >
                  +{selected.rewardPoints}p
                </span>
              </div>

              {/* Info */}
              <div>
                <h2 className="text-sm font-bold text-primary mb-1">{selected.title}</h2>
                <p className="text-[11px] text-muted">{selected.sponsor} · {formatDuration(selected.durationSeconds)}</p>
              </div>

              {/* Navigation */}
              <div className="flex gap-2">
                <button
                  onClick={goPrev}
                  disabled={!hasPrev}
                  className="flex-1 rounded-lg border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.06)] px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:border-[rgba(200,241,53,0.4)]"
                >
                  ← Previous
                </button>
                <button
                  onClick={goNext}
                  disabled={!hasNext}
                  className="flex-1 rounded-lg border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.06)] px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:border-[rgba(200,241,53,0.4)]"
                >
                  Next →
                </button>
              </div>

              <div className="text-[11px] text-muted text-center pt-2 border-t border-[rgba(200,241,53,0.08)]">
                Watch to earn {selected.rewardPoints} points
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 text-center space-y-3">
              <p className="text-muted text-sm">Select a video to begin</p>
            </div>
          )}
        </div>

        {/* RIGHT: Video list */}
        <div className="glass-card p-4 h-fit">
          <p className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-primary" style={{ textShadow: '0 0 8px rgba(200,241,53,0.2)' }}>
            Queue
          </p>

          <div className="flex flex-col gap-2">
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
                      'text-left rounded-lg p-2.5 transition-all text-[10px]',
                      selectedId === video.id
                        ? 'border border-[rgba(200,241,53,0.35)] bg-[rgba(200,241,53,0.08)] shadow-[0_0_12px_rgba(200,241,53,0.15)]'
                        : 'border border-[rgba(200,241,53,0.1)] hover:border-[rgba(200,241,53,0.2)]'
                    ].join(' ')}
                  >
                    <p className="font-bold text-primary truncate">{idx + 1}. {video.title}</p>
                    <p className="text-muted mt-0.5">{video.sponsor} · {formatDuration(video.durationSeconds)}</p>
                    <p className="text-accent font-display font-bold mt-1">+{video.rewardPoints}p</p>
                  </button>
                ))}
          </div>
        </div>
      </div>
    </div>
  )
}