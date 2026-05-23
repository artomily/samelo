'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { EarningsList } from '@/app/components/EarningsList'
import { EarningsHeader } from '@/app/components/EarningsHeader'
import { EarnPointsButton } from '@/app/components/EarnPointsButton'
import { ClaimButton } from '@/app/components/ClaimButton'
import { useSwapToMelo } from '@/hooks/useSwapToMelo'
import { toast } from '@/app/components/Toast'

export default function EarningsPage() {
  const { address } = useAccount()
  const [refreshKey, setRefreshKey] = useState(0)
  const [pendingPoints, setPendingPoints] = useState(0)

  const handleEarned = useCallback(() => {
    setRefreshKey((k) => k + 1)
    setPendingPoints((p) => p + 10)
  }, [])

  const handleClaimed = useCallback(() => {
    setPendingPoints(0)
    setRefreshKey((k) => k + 1)
  }, [])

  const { swap: swapToMelo, status: swapStatus, reset: resetSwap } = useSwapToMelo()

  useEffect(() => {
    if (swapStatus === 'success') {
      setPendingPoints(0)
      setRefreshKey((k) => k + 1)
      toast('Points swapped to $MELO!', 'success')
      resetSwap()
    }
  }, [swapStatus, resetSwap])

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <EarningsHeader />

      <div className="mx-auto w-full max-w-lg space-y-4 px-4 py-5 pb-24">
        <EarnPointsButton onEarned={handleEarned} />

        {/* Claim / Swap card */}
        {address && pendingPoints > 0 && (
          <div
            className="rounded-2xl border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.04)] p-4"
            style={{ boxShadow: '0 0 20px rgba(200,241,53,0.06)' }}
          >
            <div className="mb-3 text-center">
              <p
                className="font-display text-3xl font-black tabular-nums text-accent"
                style={{ textShadow: '0 0 16px rgba(200,241,53,0.5)' }}
              >
                {pendingPoints}
              </p>
              <p className="mt-0.5 font-display text-[9px] uppercase tracking-widest text-muted">
                pending points
              </p>
            </div>

            <ClaimButton pendingCents={pendingPoints} onClaimed={handleClaimed} />

            <button
              onClick={() => {
                if (pendingPoints <= 0) return
                void swapToMelo(pendingPoints)
              }}
              disabled={swapStatus === 'pending' || swapStatus === 'confirming'}
              className="mt-2 w-full rounded-lg border border-[rgba(200,241,53,0.3)] bg-[rgba(200,241,53,0.08)] py-2.5 text-[13px] font-bold text-accent transition-all hover:enabled:border-[rgba(200,241,53,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {swapStatus === 'pending' ? 'Confirm in wallet…' :
               swapStatus === 'confirming' ? 'Swapping…' :
               `Swap ${pendingPoints}pts → $MELO`}
            </button>
          </div>
        )}

        <EarningsList key={refreshKey} />
      </div>
    </div>
  )
}
