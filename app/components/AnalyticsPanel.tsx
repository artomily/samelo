'use client'

import { useAnalytics } from '@/hooks/useAnalytics'
import { formatUnits } from 'viem'

function Stat({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted uppercase tracking-wider">{label}</span>
      <span className="text-xl font-bold text-primary tabular-nums">{value}</span>
      {sub && <span className="text-xs text-muted">{sub}</span>}
    </div>
  )
}

function SkeletonStat() {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-3 w-16 animate-pulse rounded bg-card" />
      <div className="h-6 w-24 animate-pulse rounded bg-card" />
    </div>
  )
}

function shortenWallet(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function AnalyticsPanel() {
  const { data, isLoading } = useAnalytics(30_000)

  return (
    <section className="border-b border-border bg-surface px-4 py-4">
      {/* ── Top row: pool balance + today's activity ── */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <SkeletonStat />
            <SkeletonStat />
          </>
        ) : (
          <>
            <Stat
              label="Reward Pool"
              value={`${parseFloat(data?.poolBalance ?? '0').toFixed(4)} CELO`}
              sub={`${parseFloat(data?.totalPaidOut ?? '0').toFixed(2)} paid out`}
            />
            <Stat
              label="Today's Videos"
              value={data?.videosToday ?? 0}
              sub={`${data?.totalWatchers ?? 0} total watchers`}
            />
          </>
        )}
      </div>

      {/* ── Your earnings ── */}
      {data?.userEarningsCents != null && data.userEarningsCents > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-card px-3 py-2">
          <span className="text-sm text-muted">Your unclaimed</span>
          <span className="font-bold text-accent">
            {formatCents(data.userEarningsCents)}
          </span>
        </div>
      )}

      {/* ── Leaderboard ── */}
      {(data?.leaderboard?.length ?? 0) > 0 && (
        <div>
          <p className="mb-1.5 text-xs uppercase tracking-wider text-muted">Top Earners</p>
          <div className="space-y-1">
            {data!.leaderboard.map((entry, i) => (
              <div
                key={entry.wallet}
                className="flex items-center justify-between rounded-md bg-card px-2.5 py-1.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      i === 0
                        ? 'text-gold'
                        : i === 1
                          ? 'text-primary'
                          : 'text-muted'
                    }`}
                  >
                    #{i + 1}
                  </span>
                  <span className="font-mono text-xs text-primary">
                    {shortenWallet(entry.wallet)}
                  </span>
                </div>
                <span className="text-xs font-semibold text-accent">
                  {formatCents(entry.totalCents)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

/** Format reward cents as CELO equivalent (100 cents = 1 CELO = 1e18 wei) */
function formatCents(cents: number) {
  const wei = BigInt(cents) * BigInt(10 ** 16)
  const celo = parseFloat(formatUnits(wei, 18))
  if (celo < 0.001) return `<0.001 CELO`
  return `${celo.toFixed(3)} CELO`
}
