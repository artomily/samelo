'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { MOCK_VIDEOS } from '@/lib/mock-videos'
import { Skeleton } from '@/app/components/Skeleton'
import { useTranslation } from '@/lib/i18n'

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

const VIDEO_MAP = Object.fromEntries(MOCK_VIDEOS.map((v) => [v.id, v]))

function formatDate(epochSeconds: number): string {
  const d = new Date(epochSeconds * 1000)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function EarningsList() {
  const { address } = useAccount()
  const { t } = useTranslation()
  const [items, setItems] = useState<EarningsItem[]>([])
  const [nextCursor, setNextCursor] = useState<number | null>(0)
  const [loading, setLoading] = useState(false)
  const [totals, setTotals] = useState({ earned: 0, claimed: 0 })
  const [initialized, setInitialized] = useState(false)

  const fetchPage = useCallback(
    async (cursor: number) => {
      if (!address || loading) return
      setLoading(true)
      try {
        const res = await fetch(
          `/api/earnings/history?walletAddress=${address}&cursor=${cursor}`,
        )
        if (!res.ok) return
        const data: HistoryResponse = await res.json()
        setItems((prev) => (cursor === 0 ? data.items : [...prev, ...data.items]))
        setNextCursor(data.nextCursor)
        setTotals({ earned: data.totalEarnedCents, claimed: data.totalClaimedCents })
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    },
    [address, loading],
  )

  useEffect(() => {
    if (address) {
      setItems([])
      setNextCursor(0)
      setInitialized(false)
      fetchPage(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  const pending = totals.earned - totals.claimed

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
        <span className="text-3xl">🎬</span>
        <p className="text-sm font-medium">{t('noEarnings')}</p>
        <p className="text-xs text-muted">{t('noEarningsDesc')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-2">
        <StatPill label={t('totalEarned')} cents={totals.earned} />
        <StatPill label={t('claimedLabel')} cents={totals.claimed} accent={false} dim />
        <StatPill label={t('pending')} cents={pending} accent />
      </div>

      {/* History list */}
      <div className="space-y-2">
        {items.map((item) => {
          const video = VIDEO_MAP[item.video_id]
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">
                  {video?.title ?? `Video ${item.video_id}`}
                </p>
                <p className="text-xs text-muted">{formatDate(item.watched_at)}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-bold text-gold">
                  +${(item.reward_cents / 100).toFixed(2)}
                </span>
                <span
                  className={`text-[10px] font-semibold ${
                    item.claimed ? 'text-muted' : 'text-accent'
                  }`}
                >
                  {item.claimed ? 'Claimed' : 'Pending'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Load more */}
      {nextCursor !== null && (
        <button
          onClick={() => fetchPage(nextCursor)}
          disabled={loading}
          className="w-full rounded-xl border border-border py-2.5 text-sm font-medium text-muted transition hover:border-accent hover:text-accent disabled:opacity-50"
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
  dim = false,
}: {
  label: React.ReactNode
  cents: number
  accent?: boolean
  dim?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl border border-border bg-surface px-3 py-2.5">
      <span className="text-[10px] text-muted">{label}</span>
      <span
        className={`text-sm font-bold ${
          accent ? 'text-accent' : dim ? 'text-muted' : 'text-fg'
        }`}
      >
        ${(cents / 100).toFixed(2)}
      </span>
    </div>
  )
}
