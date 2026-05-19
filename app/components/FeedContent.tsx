'use client'

import { useState, useCallback } from 'react'
import { MOCK_VIDEOS } from '@/lib/mock-videos'
import { VideoCard } from '@/app/components/VideoCard'
import { VideoPlayer } from '@/app/components/VideoPlayer'
import { RewardCounter } from '@/app/components/RewardCounter'
import { WalletBadge } from '@/app/components/WalletBadge'
import { toast } from '@/app/components/Toast'

export default function FeedContent() {
  const [activeId, setActiveId] = useState<string>(MOCK_VIDEOS[0].id)
  const [pendingCents, setPendingCents] = useState(0)
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set())

  const activeVideo = MOCK_VIDEOS.find((v) => v.id === activeId)!

  const handleSelect = useCallback(
    (id: string) => {
      if (id === activeId) return
      setActiveId(id)
    },
    [activeId],
  )

  const handleEarned = useCallback(
    (rewardCents: number) => {
      if (earnedIds.has(activeId)) return
      setEarnedIds((prev) => new Set(prev).add(activeId))
      setPendingCents((prev) => prev + rewardCents)
      toast(`+$${(rewardCents / 100).toFixed(2)} cUSD earned!`, 'success')
    },
    [activeId, earnedIds],
  )

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="text-base font-bold tracking-tight">Semelo</span>
        </div>
        <div className="flex items-center gap-3">
          <RewardCounter pendingCents={pendingCents} />
          <WalletBadge />
        </div>
      </header>

      <div className="mx-auto w-full max-w-lg px-4 py-4">
        {/* Active player */}
        <VideoPlayer
          key={activeId}
          video={activeVideo}
          onEarned={handleEarned}
        />

        {/* Active video meta */}
        <div className="mt-3 mb-5">
          <h2 className="text-base font-semibold leading-snug">
            {activeVideo.title}
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-muted">{activeVideo.sponsor}</span>
            <span className="text-muted">·</span>
            <span className="text-xs font-semibold text-gold">
              +${(activeVideo.rewardCents / 100).toFixed(2)} cUSD
            </span>
            {earnedIds.has(activeId) && (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                Earned ✓
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
          More videos
        </p>

        {/* Video list */}
        <div className="grid grid-cols-2 gap-3">
          {MOCK_VIDEOS.filter((v) => v.id !== activeId).map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              isActive={false}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
