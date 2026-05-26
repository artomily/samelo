'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { EarningsList } from '@/app/components/EarningsList'
import { EarningsHeader } from '@/app/components/EarningsHeader'
import { EarnPointsButton } from '@/app/components/EarnPointsButton'

export default function EarningsPage() {
  const { address } = useAccount()
  const [refreshKey, setRefreshKey] = useState(0)
  const [pendingPoints, setPendingPoints] = useState(0)
  const [loadingPending, setLoadingPending] = useState(false)

  // Fetch real pending points from Supabase on mount / address change
  useEffect(() => {
    if (!address) { setPendingPoints(0); return }
    setLoadingPending(true)
    fetch(`/api/rewards/pending?walletAddress=${address}`)
      .then((r) => r.json())
      .then((d: { total?: number }) => {
        if (typeof d.total === 'number') setPendingPoints(d.total)
      })
      .catch(() => {})
      .finally(() => setLoadingPending(false))
  }, [address])

  // EarnPointsButton passes the new server-confirmed total
  const handleEarned = useCallback((newTotal: number) => {
    if (newTotal > 0) setPendingPoints(newTotal)
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-[#030303]">
      <EarningsHeader />

      <div className="w-full overflow-hidden px-4 py-4 pb-20 sm:px-7 sm:py-5 space-y-6">
        <EarnPointsButton onEarned={handleEarned} />

        {/* Pending points card */}
        {address && (
          <div
            className="rounded-2xl border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.04)] p-4"
            style={{ boxShadow: '0 0 20px rgba(200,241,53,0.06)' }}
          >
            <div className="mb-4 text-center">
              <p className="mb-1 font-display text-[9px] uppercase tracking-[0.2em] text-muted">
                Pending Points
              </p>
              {loadingPending ? (
                <div className="mx-auto h-10 w-24 animate-pulse rounded-lg bg-white/5" />
              ) : (
                <p
                  className="font-display text-4xl font-black tabular-nums text-accent"
                  style={{ textShadow: '0 0 20px rgba(200,241,53,0.5)' }}
                >
                  {pendingPoints}
                </p>
              )}
            </div>

            {pendingPoints > 0 ? (
              <div className="space-y-2">
                <Link
                  href="/swap"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(200,241,53,0.25)] bg-[rgba(200,241,53,0.07)] py-2.5 font-display text-[11px] font-bold uppercase tracking-wider text-accent transition-all hover:border-[rgba(200,241,53,0.45)] hover:bg-[rgba(200,241,53,0.12)]"
                >
                  Swap Points → CELO
                  <ArrowRight size={12} />
                </Link>
              </div>
            ) : (
              <p className="text-center text-[11px] text-muted">
                Watch videos to earn points
              </p>
            )}
          </div>
        )}

        <EarningsList key={refreshKey} />
      </div>
    </div>
  )
}
