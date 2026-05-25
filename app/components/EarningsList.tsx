'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAccount } from 'wagmi'
import { Skeleton } from '@/app/components/Skeleton'
import { useTranslation } from '@/lib/i18n'
import type { Video } from '@/lib/mock-videos'

/**
 * EarningsList - Displays user's earning history with pagination
 * Fetches video watch history and reward amounts
 * Supports infinite scroll with cursor-based pagination
 */

interface EarningsItem {
  id: number
  video_id: string
  reward_cents: number
  watched_at: number
  claimed: number
}

interface HistoryResponse {
  items: EarningsItem[]
  nextCursor: number | null
  totalEarnedCents: number
  totalClaimedCents: number
}

const FAUCET_VIDEO_ID = '__earn_faucet__'

function formatDate(epochSeconds: number): string {
  const d = new Date(epochSeconds * 1000)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function EarningsList() {
  const { address } = useAccount()
  const { t } = useTranslation()
  const [items, setItems] = useState<EarningsItem[]>([])
  const [nextCursor, setNextCursor] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [totals, setTotals] = useState({ earned: 0, claimed: 0 })
  const [initialized, setInitialized] = useState(false)
  const [videoMap, setVideoMap] = useState<Record<string, Video>>({})
  const loadingRef = useRef(false)
  const [error, setError] = useState<string | null>(null)

  // Load video titles once for the label lookup
  useEffect(() => {
    fetch('/api/videos')
      .then((r) => r.json())
      .then((d: { videos?: Video[] }) => {
        if (d.videos) {
          setVideoMap(Object.fromEntries(d.videos.map((v) => [v.id, v])))
        }
      })
      .catch(() => {})
  }, [])

  const fetchPage = useCallback(
    async (cursor: number) => {
      if (!address || loadingRef.current) return
      loadingRef.current = true
      setLoading(true)
      setError(null)
      try {
        const url = new URL('/api/earnings/history', window.location.origin)
        url.searchParams.set('walletAddress', address)
        if (cursor) url.searchParams.set('cursor', String(cursor))
        const res = await fetch(url.toString())
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Failed to load history' }))
          throw new Error(err.error ?? 'Failed to load history')
        }
        const data: HistoryResponse = await res.json()
        setItems((prev) => (cursor === 0 ? data.items : [...prev, ...data.items]))
        setNextCursor(data.nextCursor)
        setTotals({ earned: data.totalEarnedCents, claimed: data.totalClaimedCents })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load')
      } finally {
        loadingRef.current = false
        setLoading(false)
        setInitialized(true)
      }
    },
    [address],
  )

  useEffect(() => {
    if (address) {
      setItems([])
      setNextCursor(null)
      setInitialized(false)
      fetchPage(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  const available = totals.earned - totals.claimed

  if (error && items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm font-semibold text-red-400/80">Failed to load history</p>
        <p className="text-xs text-muted">{error}</p>
        <button
          onClick={() => fetchPage(0)}
          className="rounded-lg border border-[rgba(200,241,53,0.15)] px-4 py-2 text-xs text-accent transition-colors hover:border-[rgba(200,241,53,0.3)]"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!initialized) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <span className="font-display text-3xl text-accent" style={{ textShadow: '0 0 16px rgba(200,241,53,0.4)' }}>&#x25B6;</span>
        <p className="text-sm font-semibold">{t('noEarnings')}</p>
        <p className="text-xs text-muted">{t('noEarningsDesc')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Summary row */}
      <div className="grid grid-cols-2 gap-2">
        <StatPill label={t('totalEarned')} cents={totals.earned} />
        <StatPill label="Available" cents={available} accent />
      </div>

      {/* History list */}
      <div className="space-y-2">
        {items.map((item) => {
          const isFaucet = item.video_id === FAUCET_VIDEO_ID
          const video = isFaucet ? null : videoMap[item.video_id]
          return (
            <div
              key={item.id}
              className="glass-card flex items-center gap-3 px-4 py-3 transition-all hover:border-[rgba(200,241,53,0.2)]"
            >
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">
                  {isFaucet ? 'Early Adopter Claim' : (video?.title ?? `Video ${item.video_id}`)}
                </p>
                <p className="text-xs text-muted">{formatDate(item.watched_at)}</p>
              </div>
              <span
                className="shrink-0 font-display text-sm font-black text-accent"
                style={{ textShadow: '0 0 8px rgba(200,241,53,0.4)' }}
              >
                +{item.reward_cents}p
              </span>
            </div>
          )
        })}
      </div>

      {/* Load more */}
      {nextCursor !== null && (
        <button
          onClick={() => fetchPage(nextCursor)}
          disabled={loading}
          className="w-full rounded-xl border border-[rgba(200,241,53,0.12)] py-2.5 font-display text-[11px] uppercase tracking-widest text-muted transition hover:border-[rgba(200,241,53,0.3)] hover:text-accent disabled:opacity-50"
        >
          {loading ? t('loading') : t('loadMore')}
        </button>
      )}
    </div>
  )
}

function StatPill({
  label,
  cents,
  accent = false,
}: {
  label: React.ReactNode
  cents: number
  accent?: boolean
}) {
  return (
    <div className="glass-card flex flex-col gap-0.5 px-3 py-2.5 transition-all hover:border-[rgba(200,241,53,0.2)]">
      <span className="font-display text-[9px] uppercase tracking-widest text-muted">{label}</span>
      <span
        className="font-display text-sm font-black"
        style={accent ? { color: '#c8f135', textShadow: '0 0 8px rgba(200,241,53,0.4)' } : { color: '#f0f0f0' }}
      >
        {cents}p
      </span>
    </div>
  )
}
