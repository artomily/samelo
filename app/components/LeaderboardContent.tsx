'use client'

import { useState, useCallback, useRef } from 'react'
import { Trophy, Medal, Clock, Crown, Loader2, TrendingUp } from 'lucide-react'
import { useAccount } from 'wagmi'
import { cn } from '@/lib/utils'
import type { Timeframe } from '@/app/api/leaderboard/route'

interface LeaderboardEntry {
  wallet: string
  points: number
  rank: number
  displayName: string | null
}

interface LeaderboardData {
  entries: LeaderboardEntry[]
  total: number
  userRank?: { rank: number; points: number }
}

const PAGE_SIZE = 50

const TIMEFRAMES: { key: Timeframe; label: string }[] = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'all_time', label: 'All Time' },
]

function shortenWallet(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

function formatPoints(points: number) {
  if (points >= 1_000_000) return `${(points / 1_000_000).toFixed(1)}M`
  if (points >= 1_000) return `${(points / 1_000).toFixed(1)}K`
  return points.toString()
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy size={18} className="text-yellow-400" />
  if (rank === 2) return <Medal size={18} className="text-zinc-300" />
  if (rank === 3) return <Medal size={18} className="text-amber-600" />
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(200,241,53,0.1)] text-[10px] font-bold text-muted">
      {rank}
    </span>
  )
}

export function LeaderboardContent() {
  const { address } = useAccount()
  const [timeframe, setTimeframe] = useState<Timeframe>('all_time')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [total, setTotal] = useState(0)
  const [userRank, setUserRank] = useState<{ rank: number; points: number } | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const fetchIdRef = useRef(0)

  const hasMore = entries.length < total

  const fetchPage = useCallback(async (offset: number, append: boolean) => {
    const fetchId = ++fetchIdRef.current
    const isInitial = offset === 0 && !append
    if (isInitial) setLoading(true)
    else setLoadingMore(true)

    try {
      const params = new URLSearchParams({
        timeframe,
        limit: String(PAGE_SIZE),
        offset: String(offset),
      })
      if (address) params.set('walletAddress', address)

      const res = await fetch(`/api/leaderboard?${params}`)
      if (!res.ok) throw new Error('Failed to fetch leaderboard')

      const json = await res.json() as LeaderboardData
      if (fetchId !== fetchIdRef.current) return
      if (append) {
        setEntries((prev) => [...prev, ...json.entries])
      } else {
        setEntries(json.entries)
      }
      setTotal(json.total)
      setUserRank(json.userRank)
      setError(null)
      if (isInitial) setInitialized(true)
    } catch (e) {
      if (fetchId !== fetchIdRef.current) return
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      if (fetchId === fetchIdRef.current) {
        if (isInitial) setLoading(false)
        else setLoadingMore(false)
      }
    }
  }, [timeframe, address])

  const handleTimeframeChange = useCallback((tf: Timeframe) => {
    setTimeframe(tf)
    setEntries([])
    setTotal(0)
    setUserRank(undefined)
    setError(null)
    setInitialized(false)
  }, [])

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return
    fetchPage(entries.length, true)
  }, [loadingMore, hasMore, entries.length, fetchPage])

  return (
    <LeaderboardLoader
      timeframe={timeframe}
      initialized={initialized}
      fetchPage={fetchPage}
      onTimeframeChange={handleTimeframeChange}
      address={address}
      entries={entries}
      total={total}
      userRank={userRank}
      loading={loading}
      loadingMore={loadingMore}
      error={error}
      hasMore={hasMore}
      loadMore={loadMore}
      sentinelRef={sentinelRef}
    />
  )
}

interface LeaderboardLoaderProps {
  timeframe: Timeframe
  initialized: boolean
  fetchPage: (offset: number, append: boolean) => Promise<void>
  onTimeframeChange: (tf: Timeframe) => void
  address: string | undefined
  entries: LeaderboardEntry[]
  userRank: { rank: number; points: number } | undefined
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  sentinelRef: React.RefObject<HTMLDivElement | null>
}

function LeaderboardLoader({
  timeframe,
  initialized,
  fetchPage,
  onTimeframeChange,
  address,
  entries,
  userRank,
  loading,
  loadingMore,
  error,
  hasMore,
  loadMore,
  sentinelRef,
}: LeaderboardLoaderProps) {
  if (!initialized && !loading && !error) {
    fetchPage(0, false)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#030303] text-primary">
      {/* Header */}
      <header
        className="sticky top-0 left-0 right-0 z-30 flex items-center border-b border-[rgba(200,241,53,0.10)] px-4 py-3 sm:px-7 sm:py-3.5"
        style={{ background: 'rgba(3,3,3,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <h1
          className="font-display text-[13px] font-black uppercase tracking-[0.15em] text-primary"
          style={{ textShadow: '0 0 10px rgba(200,241,53,0.2)' }}
        >
          Leaderboard
        </h1>
      </header>

      <div className="w-full overflow-hidden px-4 py-4 pb-20 sm:px-7 sm:py-5">
        {/* Your rank card */}
        {userRank && (
          <div className="mb-4 rounded-2xl border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.04)] p-4">
            <p className="mb-1 font-display text-[9px] uppercase tracking-widest text-muted">Your Rank</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown size={22} className="text-accent" />
                <div>
                  <p className="font-display text-2xl font-black tabular-nums text-accent">
                    #{userRank.rank}
                  </p>
                  <p className="text-[10px] text-muted">
                    {formatPoints(userRank.points)} points
                  </p>
                </div>
              </div>
              <TrendingUp size={18} className="text-accent/40" />
            </div>
          </div>
        )}

        {/* Timeframe tabs */}
        <div className="mb-4 flex gap-1.5 rounded-xl border border-[rgba(200,241,53,0.1)] bg-[#0d0d0d] p-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.key}
              onClick={() => onTimeframeChange(tf.key)}
              className={cn(
                'flex-1 rounded-lg py-2 font-display text-[9px] font-bold uppercase tracking-wider transition-all',
                timeframe === tf.key
                  ? 'bg-accent/12 text-accent border border-[rgba(200,241,53,0.25)]'
                  : 'text-muted hover:text-primary',
              )}
            >
              {tf.key === 'weekly' && <Clock size={10} className="mr-1 inline" />}
              {tf.label}
            </button>
          ))}
        </div>

        {/* Leaderboard list */}
        {loading && entries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <Loader2 size={28} className="animate-spin text-accent/40" />
            <p className="text-xs text-muted">Loading leaderboard...</p>
          </div>
        ) : error && entries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <p className="text-xs text-muted">{error}</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-[rgba(200,241,53,0.1)] bg-[#0d0d0d] overflow-hidden">
            {/* Header row */}
            <div className="flex items-center gap-3 border-b border-[rgba(200,241,53,0.08)] px-4 py-2.5">
              <span className="w-8 text-center font-display text-[8px] uppercase tracking-widest text-muted">
                #
              </span>
              <span className="flex-1 font-display text-[8px] uppercase tracking-widest text-muted">
                Wallet
              </span>
              <span className="font-display text-[8px] uppercase tracking-widest text-muted">
                Points
              </span>
            </div>

            <div className="divide-y divide-[rgba(200,241,53,0.06)]">
              {entries.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-16">
                  <Trophy size={32} className="text-muted/30" />
                  <p className="text-xs text-muted">No entries yet</p>
                  <p className="text-[10px] text-muted/50">Start watching to earn points</p>
                </div>
              ) : (
                entries.map((entry) => (
                  <div
                    key={`${entry.wallet}-${entry.rank}`}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[rgba(200,241,53,0.02)]',
                      address && entry.wallet === address.toLowerCase() && 'bg-[rgba(200,241,53,0.04)]',
                    )}
                  >
                    <span className="flex w-8 items-center justify-center">
                      <RankBadge rank={entry.rank} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-mono text-xs text-primary">
                        {entry.displayName ?? shortenWallet(entry.wallet)}
                      </p>
                    </div>
                    <span
                      className="shrink-0 font-display text-sm font-black tabular-nums text-accent"
                      style={{ textShadow: '0 0 8px rgba(200,241,53,0.2)' }}
                    >
                      {formatPoints(entry.points)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {hasMore && (
              <div ref={sentinelRef} className="flex items-center justify-center py-4">
                {loadingMore && <Loader2 size={18} className="animate-spin text-accent/40" />}
                {!loadingMore && (
                  <button
                    onClick={loadMore}
                    className="font-display text-[10px] uppercase tracking-widest text-muted hover:text-accent transition-colors"
                  >
                    Load more
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
