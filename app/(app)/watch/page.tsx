'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useVideos } from '@/hooks/useVideos'
import { Skeleton } from '@/app/components/Skeleton'

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function WatchPage() {
  const { videos, loading } = useVideos()

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
          Watch Now
        </Link>
      </header>

      {/* Video grid */}
      <div className="grid grid-cols-1 gap-3 px-4 py-4 pb-28 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                  <Skeleton className="h-8 w-full rounded-lg" />
                </div>
              </div>
            ))
          : videos.map((video) => (
              <div
                key={video.id}
                className="glass-card overflow-hidden transition-all duration-200 hover:border-[rgba(200,241,53,0.3)]"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-[rgba(200,241,53,0.03)]">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {/* Reward badge */}
                  <span
                    className="absolute right-2 top-2 rounded-md border border-[rgba(200,241,53,0.4)] bg-[rgba(3,3,3,0.85)] px-2 py-0.5 font-display text-[10px] font-bold text-accent"
                    style={{ textShadow: '0 0 8px rgba(200,241,53,0.6)' }}
                  >
                    +{video.rewardPoints}p
                  </span>
                  {/* Duration badge */}
                  <span className="absolute bottom-2 right-2 rounded bg-[rgba(3,3,3,0.75)] px-1.5 py-0.5 font-display text-[9px] text-muted">
                    {formatDuration(video.durationSeconds)}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="mb-0.5 line-clamp-2 text-[13px] font-semibold leading-snug text-primary">
                    {video.title}
                  </p>
                  <p className="mb-3 text-[11px] text-muted">{video.sponsor}</p>
                  <Link
                    href="/home"
                    className="btn-neon inline-flex w-full items-center justify-center py-2 text-[11px] font-bold uppercase tracking-widest"
                  >
                    Watch &amp; Earn
                  </Link>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}
