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
            className="flex h-6 flex-1 items-center justify-center rounded-md font-display text-[9px] uppercase tracking-wider transition-all"
            style={done ? {
              border: '1px solid rgba(200,241,53,0.3)',
              background: 'rgba(200,241,53,0.08)',
              color: '#c8f135',
              boxShadow: '0 0 6px rgba(200,241,53,0.15)',
            } : {
              border: '1px solid rgba(200,241,53,0.08)',
              background: 'rgba(200,241,53,0.02)',
              color: 'rgba(200,241,53,0.25)',
            }}
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
    <div className="flex min-h-dvh flex-col bg-[#030303]">
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(200,241,53,0.10)] px-4 py-3 sm:px-7 sm:py-3.5"
        style={{ background: 'rgba(3,3,3,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <div>
          <p
            className="font-display text-[13px] font-black uppercase tracking-[0.15em] text-primary sm:text-[14px]"
            style={{ textShadow: '0 0 10px rgba(200,241,53,0.2)' }}
          >
            Mission Control
          </p>
          <p className="mt-0.5 hidden text-[11px] text-muted sm:block">{listVideos.length} transmissions queued</p>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-lg border border-[rgba(200,241,53,0.15)] bg-[rgba(200,241,53,0.04)] px-2.5 py-1.5 text-xs text-muted sm:gap-2 sm:px-3.5 sm:py-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" style={{ boxShadow: '0 0 6px rgba(200,241,53,0.8)' }} />
          <WalletBadge />
        </div>
      </header>

      <div className="w-full px-4 py-4 pb-28 sm:px-7 sm:py-5">
        <ConnectBanner className="mb-5" />

        {/* 4-col Metrics */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-5 sm:gap-2.5 sm:grid-cols-4">
          <div className="glass-card p-3 sm:p-4" style={{ borderColor: 'rgba(200,241,53,0.25)', boxShadow: '0 0 16px rgba(200,241,53,0.06)' }}>
            <p className="mb-1 font-display text-[9px] uppercase tracking-widest text-muted">Total earned</p>
            <p className="font-display text-lg font-black tabular-nums text-accent sm:text-xl" style={{ textShadow: '0 0 10px rgba(200,241,53,0.35)' }}>${(pendingCents / 100).toFixed(2)}</p>
            <p className="mt-0.5 text-[10px] text-accent/60">↑ today</p>
          </div>
          <div className="glass-card p-3 sm:p-4">
            <p className="mb-1 font-display text-[9px] uppercase tracking-widest text-muted">Pending pts</p>
            <p className="font-display text-lg font-black tabular-nums text-primary sm:text-xl">{pendingCents}</p>
            <p className="mt-0.5 text-[10px] text-accent/60">↑ {earnedIds.size * 10} today</p>
          </div>
          <div className="glass-card p-3 sm:p-4">
            <p className="mb-1 font-display text-[9px] uppercase tracking-widest text-muted">On-chain</p>
            <p className="font-display text-lg font-black tabular-nums text-primary sm:text-xl">0</p>
            <p className="mt-0.5 text-[10px] text-muted">Deploy ready</p>
          </div>
          <div className="glass-card p-3 sm:p-4">
            <p className="mb-1 font-display text-[9px] uppercase tracking-widest text-muted">Referrals</p>
            <p className="font-display text-lg font-black tabular-nums text-primary sm:text-xl">0</p>
            <p className="mt-0.5 text-[10px] text-accent/60">Invite friends</p>
          </div>
        </div>

        {/* 2-col main layout */}
        <div className="grid gap-3 md:grid-cols-[1fr_300px] sm:gap-3.5">
          {/* LEFT: video list + streak */}
          <div className="glass-card p-4">
            <div className="mb-3.5 flex items-center justify-between">
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-primary" style={{ textShadow: '0 0 8px rgba(200,241,53,0.2)' }}>Today&apos;s Transmissions</p>
              <span className="font-display text-[9px] uppercase tracking-widest text-muted">{MOCK_VIDEOS.length} queued</span>
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
                    i < MOCK_VIDEOS.length - 1 ? 'border-b border-[rgba(200,241,53,0.07)]' : '',
                  ].join(' ')}
                >
                  <button
                    onClick={() => handleSelect(video.id)}
                    className="flex h-8 w-10 shrink-0 items-center justify-center rounded-md border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.06)] transition-all hover:border-[rgba(200,241,53,0.4)] sm:h-9 sm:w-13"
                    style={{ boxShadow: '0 0 8px rgba(200,241,53,0.08)' }}
                  >
                    <Play size={14} className="text-accent" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-primary">{video.title}</p>
                    <p className="text-[11px] text-muted">{video.sponsor} · {video.durationSeconds}s</p>
                  </div>
                  <span className="shrink-0 font-display text-[11px] font-bold text-accent" style={{ textShadow: '0 0 8px rgba(200,241,53,0.4)' }}>+${(video.rewardCents / 100).toFixed(2)}</span>
                  {earnedIds.has(video.id) ? (
                    <span className="shrink-0 rounded-md border border-[rgba(200,241,53,0.25)] bg-[rgba(200,241,53,0.08)] px-3 py-1 font-display text-[9px] font-bold uppercase tracking-wider text-accent">Done</span>
                  ) : (
                    <button
                      onClick={() => handleSelect(video.id)}
                      className="shrink-0 btn-neon px-3 py-1 text-[10px]"
                    >
                      Watch
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Streak */}
            <div className="mt-4 border-t border-[rgba(200,241,53,0.08)] pt-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-primary">Daily streak</p>
                <StreakBadge watchedToday={earnedIds.size > 0} />
              </div>
              <StreakRow watchedToday={earnedIds.size > 0} />
            </div>
          </div>

          {/* RIGHT: points + activity */}
          <div className="flex flex-col gap-3.5">
            {/* Points deploy card */}
            <div className="glass-card p-4" style={{ borderColor: 'rgba(200,241,53,0.2)' }}>
              <p className="mb-3.5 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-primary" style={{ textShadow: '0 0 8px rgba(200,241,53,0.2)' }}>Points to Deploy</p>
              <div className="mb-3.5 rounded-xl border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.04)] p-4 text-center">
                <p className="font-display text-3xl font-black tabular-nums text-accent" style={{ textShadow: '0 0 16px rgba(200,241,53,0.5)' }}>{pendingCents}</p>
                <p className="mt-0.5 font-display text-[9px] uppercase tracking-widest text-muted">pending off-chain pts</p>
              </div>
              {address ? (
                <ClaimButton pendingCents={pendingCents} onClaimed={handleClaimed} />
              ) : (
                <button disabled className="w-full rounded-lg bg-accent/40 py-2.5 text-[13px] font-medium text-white/50">
                  Deploy Onchain
                </button>
              )}
              <p className="mt-2.5 text-center font-display text-[9px] uppercase tracking-widest text-muted/50">Next deployment available soon</p>
            </div>

            {/* Recent activity */}
            <div className="glass-card p-4">
              <p className="mb-3.5 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-primary" style={{ textShadow: '0 0 8px rgba(200,241,53,0.2)' }}>Recent Activity</p>
              <div className="flex flex-col text-[11px]">
                {earnedIds.size > 0 ? (
                  <>
                    {[...earnedIds].map((id) => {
                      const v = MOCK_VIDEOS.find((x) => x.id === id)
                      return v ? (
                        <div key={id} className="flex justify-between border-b border-[rgba(200,241,53,0.07)] py-1.5 text-muted last:border-0">
                          <span>Watched video</span>
                          <span className="font-display font-bold text-accent">+10 pts</span>
                        </div>
                      ) : null
                    })}
                    <div className="flex justify-between border-b border-[rgba(200,241,53,0.07)] py-1.5 text-muted last:border-0">
                      <span>Daily check-in</span>
                      <span className="font-display font-bold text-accent">+5 pts</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between border-b border-[rgba(200,241,53,0.07)] py-1.5 text-muted">
                      <span>Daily check-in</span>
                      <span className="font-display font-bold text-accent">+5 pts</span>
                    </div>
                    <div className="flex justify-between border-b border-[rgba(200,241,53,0.07)] py-1.5 text-muted">
                      <span>Referral confirmed</span>
                      <span className="font-display font-bold text-accent">+50 pts</span>
                    </div>
                    <div className="flex justify-between border-b border-[rgba(200,241,53,0.07)] py-1.5 text-muted">
                      <span>Streak bonus</span>
                      <span className="font-display font-bold text-accent">+25 pts</span>
                    </div>
                    <div className="flex justify-between py-1.5 text-muted">
                      <span>Watch a video</span>
                      <span className="font-display font-bold text-accent">+10 pts</span>
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


