'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import { MOCK_VIDEOS } from '@/lib/mock-videos'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/app/components/Skeleton'
import { WalletBadge } from '@/app/components/WalletBadge'
import { ClaimButton } from '@/app/components/ClaimButton'
import { ConnectBanner } from '@/app/components/ConnectBanner'
import { toast } from '@/app/components/Toast'
import { Play } from 'lucide-react'

const VideoPlayer = dynamic(
  () => import('@/app/components/VideoPlayer').then((m) => ({ default: m.VideoPlayer })),
  {
    ssr: false,
    loading: () => <Skeleton className="aspect-video w-full rounded-xl" />,
  }
)

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function useStreakIdx(watchedToday: boolean) {
  const today = new Date().getDay()
  const todayIdx = today === 0 ? 6 : today - 1
  return { todayIdx, streakDays: Math.max(1, todayIdx) + (watchedToday ? 1 : 0) }
}

function StreakRow({ watchedToday }: { watchedToday: boolean }) {
  const { todayIdx } = useStreakIdx(watchedToday)
  return (
    <div className="flex gap-1.5">
      {DAYS.map((day, i) => {
        const done = i < todayIdx || (i === todayIdx && watchedToday)
        return (
          <div
            key={day}
            className={[
              'flex h-6 flex-1 items-center justify-center rounded-md text-[10px]',
              done
                ? 'border border-accent/30 bg-accent/10 text-gold'
                : 'border border-border bg-surface text-muted',
            ].join(' ')}
          >
            {day}
          </div>
        )
      })}
    </div>
  )
}

function StreakBadge({ watchedToday }: { watchedToday: boolean }) {
  const { streakDays } = useStreakIdx(watchedToday)
  return (
    <span className="text-[11px] text-gold">🔥 {streakDays} days</span>
  )
}

export default function FeedContent() {
  const { address } = useAccount()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [pendingCents, setPendingCents] = useState(0)
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set())
  const watchTokenRef = useRef<string | null>(null)

  const activeVideo = activeId ? MOCK_VIDEOS.find((v) => v.id === activeId) ?? null : null

  useEffect(() => {
    if (!address || !activeId) return
    watchTokenRef.current = null
    fetch(`/api/watch/token?videoId=${activeId}&walletAddress=${address}`)
      .then((r) => r.json())
      .then((d: { token?: string }) => {
        watchTokenRef.current = d.token ?? null
      })
      .catch(() => {})
  }, [activeId, address])

  useEffect(() => {
    if (!address) return
    fetch(`/api/rewards/pending?walletAddress=${address}`)
      .then((r) => r.json())
      .then((d: { totalCents?: number }) => {
        if (typeof d.totalCents === 'number') setPendingCents(d.totalCents)
      })
      .catch(() => {})
  }, [address])

  const handleSelect = useCallback((id: string) => {
    setActiveId(id)
    setTimeout(() => {
      document.getElementById('player-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }, [])

  const handleEarned = useCallback(
    async (rewardCents: number) => {
      if (!activeId || earnedIds.has(activeId)) return
      setEarnedIds((prev) => new Set(prev).add(activeId))
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
          if (typeof data.totalPendingCents === 'number') setPendingCents(data.totalPendingCents)
        }
      } catch {
        // optimistic update stands
      }
    },
    [activeId, earnedIds, address],
  )

  const handleClaimed = useCallback(() => {
    setPendingCents(0)
    setEarnedIds(new Set())
  }, [])

  const listVideos = MOCK_VIDEOS.filter((v) => v.id !== activeId)

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg/95 px-4 py-3 backdrop-blur-sm sm:px-7 sm:py-3.5">
        <div>
          <p className="text-[14px] font-medium text-primary sm:text-[15px]">Good morning 👋</p>
          <p className="mt-0.5 hidden text-[12px] text-muted sm:block">You have {listVideos.length} videos ready today</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-muted sm:gap-2 sm:px-3.5 sm:py-2">
          <span className="h-1.75 w-1.75 rounded-full bg-green-500" />
          <WalletBadge />
        </div>
      </header>

      <div className="w-full px-4 py-4 pb-28 sm:px-7 sm:py-5">
        <ConnectBanner className="mb-5" />

        {/* 4-col Metrics */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-5 sm:gap-2.5 sm:grid-cols-4">
          <div className="rounded-xl border border-accent/30 bg-card p-3 sm:p-4">
            <p className="mb-1 text-[11px] text-muted">Total earned</p>
            <p className="text-lg font-medium tabular-nums text-gold sm:text-xl">${(pendingCents / 100).toFixed(2)}</p>
            <p className="mt-0.5 text-[11px] text-green-500">↑ today</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
            <p className="mb-1 text-[11px] text-muted">Pending pts</p>
            <p className="text-lg font-medium tabular-nums text-primary sm:text-xl">{pendingCents}</p>
            <p className="mt-0.5 text-[11px] text-green-500">↑ {earnedIds.size * 10} today</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
            <p className="mb-1 text-[11px] text-muted">On-chain</p>
            <p className="text-lg font-medium tabular-nums text-primary sm:text-xl">0</p>
            <p className="mt-0.5 text-[11px] text-muted">Deploy ready</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
            <p className="mb-1 text-[11px] text-muted">Referrals</p>
            <p className="text-lg font-medium tabular-nums text-primary sm:text-xl">0</p>
            <p className="mt-0.5 text-[11px] text-green-500">Invite friends</p>
          </div>
        </div>

        {/* 2-col main layout */}
        <div className="grid gap-3 md:grid-cols-[1fr_300px] sm:gap-3.5">
          {/* LEFT: video list + streak */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3.5 flex items-center justify-between">
              <p className="text-[13px] font-medium text-primary">Today&apos;s content</p>
              <span className="text-[11px] text-muted">{MOCK_VIDEOS.length} available</span>
            </div>

            {/* Active player */}
            {activeVideo && (
              <div id="player-area" className="mb-4 scroll-mt-20">
                <VideoPlayer key={activeId!} video={activeVideo} onEarned={handleEarned} />
                <div className="mt-2 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-medium text-primary">{activeVideo.title}</p>
                    <p className="text-[11px] text-muted">{activeVideo.sponsor}</p>
                  </div>
                  {earnedIds.has(activeId!) && (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">Earned ✓</span>
                  )}
                </div>
                <div className="my-3 h-px bg-border" />
              </div>
            )}

            {/* Video rows */}
            <div className="flex flex-col">
              {MOCK_VIDEOS.map((video, i) => (
                <div
                  key={video.id}
                  className={[
                    'flex items-center gap-3 py-2.5',
                    i < MOCK_VIDEOS.length - 1 ? 'border-b border-border' : '',
                  ].join(' ')}
                >
                  <button
                    onClick={() => handleSelect(video.id)}
                    className="flex h-8 w-10 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-surface sm:h-9 sm:w-13"
                  >
                    <Play size={14} className="text-accent" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-primary">{video.title}</p>
                    <p className="text-[11px] text-muted">{video.sponsor} · {video.durationSeconds}s</p>
                  </div>
                  <span className="shrink-0 text-[12px] font-medium text-gold">+${(video.rewardCents / 100).toFixed(2)}</span>
                  {earnedIds.has(video.id) ? (
                    <span className="shrink-0 rounded-md bg-accent/15 px-3 py-1.25 text-[11px] font-medium text-accent">Done</span>
                  ) : (
                    <button
                      onClick={() => handleSelect(video.id)}
                      className="shrink-0 rounded-md bg-accent px-3 py-1.25 text-[11px] font-medium text-white"
                    >
                      Watch
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Streak */}
            <div className="mt-4 border-t border-border pt-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-medium text-primary">Daily streak</p>
                <StreakBadge watchedToday={earnedIds.size > 0} />
              </div>
              <StreakRow watchedToday={earnedIds.size > 0} />
            </div>
          </div>

          {/* RIGHT: points + activity */}
          <div className="flex flex-col gap-3.5">
            {/* Points deploy card */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-3.5 text-[13px] font-medium text-primary">Points to deploy</p>
              <div className="mb-3.5 rounded-xl border border-accent/30 bg-surface p-4 text-center">
                <p className="text-3xl font-medium tabular-nums text-gold">{pendingCents}</p>
                <p className="mt-0.5 text-[11px] text-muted">pending off-chain points</p>
              </div>
              {address ? (
                <ClaimButton pendingCents={pendingCents} onClaimed={handleClaimed} />
              ) : (
                <button disabled className="w-full rounded-lg bg-accent/40 py-2.5 text-[13px] font-medium text-white/50">
                  Deploy Onchain
                </button>
              )}
              <p className="mt-2.5 text-center text-[11px] text-muted">Next deployment available soon</p>
            </div>

            {/* Recent activity */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-3.5 text-[13px] font-medium text-primary">Recent activity</p>
              <div className="flex flex-col text-[12px]">
                {earnedIds.size > 0 ? (
                  <>
                    {[...earnedIds].map((id) => {
                      const v = MOCK_VIDEOS.find((x) => x.id === id)
                      return v ? (
                        <div key={id} className="flex justify-between border-b border-border py-1.5 text-muted last:border-0">
                          <span>Watched video</span>
                          <span className="font-medium text-gold">+10 pts</span>
                        </div>
                      ) : null
                    })}
                    <div className="flex justify-between border-b border-border py-1.5 text-muted last:border-0">
                      <span>Daily check-in</span>
                      <span className="font-medium text-gold">+5 pts</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between border-b border-border py-1.5 text-muted">
                      <span>Daily check-in</span>
                      <span className="font-medium text-gold">+5 pts</span>
                    </div>
                    <div className="flex justify-between border-b border-border py-1.5 text-muted">
                      <span>Referral confirmed</span>
                      <span className="font-medium text-gold">+50 pts</span>
                    </div>
                    <div className="flex justify-between border-b border-border py-1.5 text-muted">
                      <span>Streak bonus</span>
                      <span className="font-medium text-gold">+25 pts</span>
                    </div>
                    <div className="flex justify-between py-1.5 text-muted">
                      <span>Watch a video</span>
                      <span className="font-medium text-gold">+10 pts</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


