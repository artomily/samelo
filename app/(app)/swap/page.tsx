'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import Link from 'next/link'
import { ArrowLeft, ArrowDown, Zap } from 'lucide-react'
import { formatUnits } from 'viem'
import { MELO_ABI } from '@/lib/melo.abi'
import { useSwapToMelo } from '@/hooks/useSwapToMelo'
import { toast } from '@/app/components/Toast'
import { ConnectBanner } from '@/app/components/ConnectBanner'
import { Skeleton } from '@/app/components/Skeleton'

const MELO_ADDRESS = process.env.NEXT_PUBLIC_MELO_ADDRESS as `0x${string}` | undefined
const MELO_DECIMALS = 18

const POINTS_PER_MELO = 1000

const REDEMPTION_OPTIONS = [
  { points: 1000, melo: 1 },
  { points: 2500, melo: 2.5 },
  { points: 5000, melo: 5 },
  { points: 10000, melo: 10 },
  { points: 25000, melo: 25 },
  { points: 50000, melo: 50 },
  { points: 100000, melo: 100 },
  { points: 250000, melo: 250 },
]

export default function SwapPage() {
  const { address } = useAccount()

  const [pendingPoints, setPendingPoints] = useState(0)
  const [loadingPending, setLoadingPending] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const selected = selectedIndex !== null ? REDEMPTION_OPTIONS[selectedIndex] : null

  const { data: meloRaw, isLoading: loadingMelo, refetch: refetchMelo } = useReadContract({
    address: MELO_ADDRESS,
    abi: MELO_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!MELO_ADDRESS, refetchInterval: 15_000 },
  })
  const meloBalance =
    meloRaw !== undefined
      ? Number(formatUnits(meloRaw as bigint, MELO_DECIMALS)).toFixed(2)
      : '—'

  const fetchPending = useCallback(() => {
    if (!address) return
    setLoadingPending(true)
    fetch(`/api/rewards/pending?walletAddress=${address}`)
      .then((r) => r.json())
      .then((d: { totalCents?: number }) => {
        const pts = typeof d.totalCents === 'number' ? d.totalCents : 0
        setPendingPoints(pts)
      })
      .catch(() => {})
      .finally(() => setLoadingPending(false))
  }, [address])

  useEffect(() => {
    fetchPending()
  }, [fetchPending])

  const { swap: swapToMelo, status: swapStatus, reset: resetSwap } = useSwapToMelo()

  useEffect(() => {
    if (swapStatus === 'success') {
      toast(`Swapped ${selected?.points} pts → ${selected?.melo} $MELO!`, 'success')
      setPendingPoints((p) => Math.max(0, p - (selected?.points ?? 0)))
      setSelectedIndex(null)
      void refetchMelo()
      resetSwap()
    }
    if (swapStatus === 'error') {
      toast('Swap failed — try again', 'error')
    }
  }, [swapStatus, selected, refetchMelo, resetSwap])

  const handleSwap = useCallback(() => {
    if (!selected || selected.points <= 0) return
    void swapToMelo(selected.points)
  }, [selected, swapToMelo])

  const isPending = swapStatus === 'pending' || swapStatus === 'confirming'

  return (
    <div className="flex min-h-dvh flex-col bg-[#030303]">
      <header
        className="sticky top-0 z-30 flex items-center gap-3 border-b border-[rgba(200,241,53,0.10)] px-4 py-3"
        style={{ background: 'rgba(3,3,3,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <Link
          href="/earnings"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(200,241,53,0.15)] text-muted transition-colors hover:border-[rgba(200,241,53,0.4)] hover:text-accent"
        >
          <ArrowLeft size={15} />
        </Link>
        <h1
          className="font-display text-[13px] font-black uppercase tracking-[0.15em] text-primary"
          style={{ textShadow: '0 0 10px rgba(200,241,53,0.2)' }}
        >
          Swap Points → $MELO
        </h1>
      </header>

      <div className="mx-auto w-full max-w-sm px-4 py-6 pb-28 space-y-5">
        {!address ? (
          <ConnectBanner />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <BalanceCard
                label="Pending Points"
                value={loadingPending ? null : String(pendingPoints)}
                unit="pts"
                accent
              />
              <BalanceCard
                label="$MELO Balance"
                value={loadingMelo ? null : meloBalance}
                unit="MELO"
                accent={false}
                dim={!MELO_ADDRESS}
                dimNote={!MELO_ADDRESS ? 'Contract not deployed' : undefined}
              />
            </div>

            <div
              className="rounded-2xl border border-[rgba(200,241,53,0.18)] bg-[#0d0d0d] p-5"
              style={{ boxShadow: '0 0 28px rgba(200,241,53,0.06)' }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-display text-[9px] uppercase tracking-[0.2em] text-muted">
                  Select Redemption Tier
                </span>
                <span className="font-display text-[9px] uppercase tracking-widest text-muted/50">
                  1 MELO = {POINTS_PER_MELO.toLocaleString()} pts
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {REDEMPTION_OPTIONS.map((opt, i) => {
                  const canAfford = pendingPoints >= opt.points
                  const isSelected = selectedIndex === i

                  return (
                    <button
                      key={opt.points}
                      onClick={() => canAfford && setSelectedIndex(i)}
                      disabled={!canAfford}
                      className="relative rounded-xl border px-3 py-3 text-left transition-all disabled:cursor-not-allowed"
                      style={
                        isSelected
                          ? {
                              borderColor: 'rgba(200,241,53,0.5)',
                              background: 'rgba(200,241,53,0.1)',
                              boxShadow: '0 0 16px rgba(200,241,53,0.15)',
                            }
                          : canAfford
                            ? {
                                borderColor: 'rgba(200,241,53,0.15)',
                                background: 'rgba(200,241,53,0.03)',
                              }
                            : {
                                borderColor: 'rgba(200,241,53,0.06)',
                                background: 'rgba(200,241,53,0.01)',
                              }
                      }
                    >
                      <div
                        className="font-display text-lg font-black tabular-nums"
                        style={
                          canAfford
                            ? { color: '#c8f135', textShadow: '0 0 8px rgba(200,241,53,0.3)' }
                            : { color: 'rgba(200,241,53,0.15)' }
                        }
                      >
                        {opt.melo % 1 === 0 ? opt.melo : opt.melo.toFixed(1)}
                        <span className="ml-1 font-display text-[9px] font-bold uppercase tracking-wider text-muted/50">
                          MELO
                        </span>
                      </div>
                      <div className="mt-0.5 font-display text-[10px] uppercase tracking-wider text-muted/50">
                        {opt.points.toLocaleString()} pts
                      </div>
                      {isSelected && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-[rgba(200,241,53,0.4)] bg-[rgba(200,241,53,0.15)]">
                          <div className="h-2 w-2 rounded-full bg-accent" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {selected && (
                <div className="flex justify-center py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(200,241,53,0.2)] bg-[#080808]">
                    <ArrowDown size={14} className="text-accent" />
                  </div>
                </div>
              )}

              <button
                onClick={handleSwap}
                disabled={!selected || isPending || !MELO_ADDRESS}
                className="w-full rounded-xl border border-[rgba(200,241,53,0.35)] bg-[rgba(200,241,53,0.10)] py-3.5 font-display text-[13px] font-bold uppercase tracking-wider text-accent transition-all hover:enabled:border-[rgba(200,241,53,0.6)] hover:enabled:bg-[rgba(200,241,53,0.18)] disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
                style={selected && !isPending ? { boxShadow: '0 0 16px rgba(200,241,53,0.12)' } : {}}
              >
                {!MELO_ADDRESS
                  ? 'Contract Not Deployed'
                  : swapStatus === 'pending'
                    ? 'Confirm in Wallet…'
                    : swapStatus === 'confirming'
                      ? 'Confirming on-chain…'
                      : !selected
                        ? 'Select a Tier'
                        : `Swap ${selected.points.toLocaleString()} pts → ${selected.melo} $MELO`}
              </button>

              {swapStatus === 'error' && (
                <p className="mt-2 text-center text-[11px] text-red-400">
                  Swap failed.{' '}
                  <button onClick={resetSwap} className="underline">
                    Try again
                  </button>
                </p>
              )}
            </div>

            <div className="space-y-2 rounded-xl border border-[rgba(200,241,53,0.08)] bg-[rgba(200,241,53,0.02)] p-4">
              <p className="font-display text-[10px] uppercase tracking-[0.15em] text-muted">
                How it works
              </p>
              <ul className="space-y-1.5 text-[11px] text-muted/70">
                <li className="flex gap-2">
                  <span className="shrink-0 text-accent">01</span>
                  Watch videos to earn off-chain points
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-accent">02</span>
                  Choose a redemption tier to swap points for $MELOUSD
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-accent">03</span>
                  1,000 points = 1 $MELOUSD — lands directly in your wallet
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function BalanceCard({
  label,
  value,
  unit,
  accent,
  dim,
  dimNote,
}: {
  label: string
  value: string | null
  unit: string
  accent: boolean
  dim?: boolean
  dimNote?: string
}) {
  return (
    <div
      className="rounded-xl border border-[rgba(200,241,53,0.12)] bg-[#0d0d0d] px-4 py-3"
      style={accent ? { borderColor: 'rgba(200,241,53,0.22)', boxShadow: '0 0 16px rgba(200,241,53,0.05)' } : {}}
    >
      <p className="font-display text-[9px] uppercase tracking-[0.15em] text-muted">{label}</p>
      {value === null ? (
        <Skeleton className="mt-1.5 h-6 w-16 rounded" />
      ) : (
        <div className="mt-1 flex items-baseline gap-1.5">
          <span
            className="font-display text-xl font-black tabular-nums"
            style={
              dim
                ? { color: 'rgba(200,241,53,0.2)' }
                : accent
                ? { color: '#c8f135', textShadow: '0 0 10px rgba(200,241,53,0.4)' }
                : { color: '#f0f0f0' }
            }
          >
            {value}
          </span>
          <span className="font-display text-[9px] uppercase tracking-wider text-muted/60">
            {unit}
          </span>
        </div>
      )}
      {dimNote && (
        <p className="mt-0.5 text-[9px] text-muted/50">{dimNote}</p>
      )}
    </div>
  )
}
