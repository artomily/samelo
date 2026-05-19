'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import { MOCK_VIDEOS } from '@/lib/mock-videos'
import { VideoCard } from '@/app/components/VideoCard'
import { VideoPlayer } from '@/app/components/VideoPlayer'
import { RewardCounter } from '@/app/components/RewardCounter'
import { WalletBadge } from '@/app/components/WalletBadge'
import { ClaimButton } from '@/app/components/ClaimButton'
import { toast } from '@/app/components/Toast'

export default function FeedContent() {
  const { address } = useAccount()
  const [activeId, setActiveId] = useState<string>(MOCK_VIDEOS[0].id)
  const [pendingCents, setPendingCents] = useState(0)
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set())
  const watchTokenRef = useRef<string | null>(null)

  const activeVideo = MOCK_VIDEOS.find((v) => v.id === activeId)!

  // Fetch watch token whenever the active video or wallet changes
  useEffect(() => {
    if (!address) return
    watchTokenRef.current = null
    fetch(`/api/watch/token?videoId=${activeId}&walletAddress=${address}`)
      .then((r) => r.json())
      .then((d: { token?: string }) => {
        watchTokenRef.current = d.token ?? null
      })
      .catch(() => {})
  }, [activeId, address])

  // Sync pending from server on mount
  useEffect(() => {
    if (!address) return
    fetch(`/api/rewards/pending?walletAddress=${address}`)
      .then((r) => r.json())
      .then((d: { totalCents?: number }) => {
        if (typeof d.totalCents === 'number') {
          setPendingCents(d.totalCents)
        }
      })
      .catch(() => {})
  }, [address])

  const handleSelect = useCallback(
    (id: string) => {
      if (id === activeId) return
      setActiveId(id)
    },
    [activeId],
  )

  const handleEarned = useCallback(
    async (rewardCents: number) => {
      if (earnedIds.has(activeId)) return
      setEarnedIds((prev) => new Set(prev).add(activeId))
      // Optimistic update
      setPendingCents((prev) => prev + rewardCents)
      toast(`+$${(rewardCents / 100).toFixed(2)} cUSD earned!`, 'success')

      if (!address || !watchTokenRef.current) return

      try {
        const res = await fetch('/api/watch/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoId: activeId,
            walletAddress: address,
            token: watchTokenRef.current,
          }),
        })
        if (res.ok) {
          const data = (await res.json()) as { totalPendingCents?: number }
          if (typeof data.totalPendingCents === 'number') {
            setPendingCents(data.totalPendingCents)
          }
        }
      } catch {
        // Network error — optimistic update remains, will re-sync on next mount
      }
    },
    [activeId, earnedIds, address],
  )

  const handleClaimed = useCallback(() => {
    setPendingCents(0)
    setEarnedIds(new Set())
  }, [])

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
        <div className="mt-3 mb-4">
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

        {/* Claim */}
        <div className="mb-6">
          <ClaimButton
            pendingCents={pendingCents}
            onClaimed={handleClaimed}
          />
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


