'use client'

import { useMiniPay } from '@/hooks/useMiniPay'
import { useCUSDBalance } from '@/hooks/useCUSDBalance'
import { WalletBadge } from './WalletBadge'

/**
 * HomeScreen - Main landing page when connected
 * Displays brand, wallet details, and feed of available videos
 * Serves as entry point for authenticated users
 */
export function HomeScreen() {
  const { address } = useMiniPay()
  const { display: balance, isLoading } = useCUSDBalance(address)

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="text-lg font-bold tracking-tight">Semelo</span>
        </div>
        <WalletBadge />
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-12 text-center">
        {/* Balance hero */}
        <div>
          <div className="mb-1 text-5xl font-bold text-accent">
            {isLoading ? (
              <span className="inline-block h-12 w-28 animate-pulse rounded-lg bg-card" />
            ) : (
              `$${balance}`
            )}
          </div>
          <div className="text-sm text-muted">total earned (cUSD)</div>
        </div>

        {/* Stats card */}
        <div className="w-full max-w-xs rounded-2xl border border-border bg-card p-5 text-left">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
            Your stats
          </div>
          <div className="flex items-center justify-between border-b border-border py-2.5">
            <span className="text-sm">Videos watched</span>
            <span className="font-semibold">0</span>
          </div>
          <div className="flex items-center justify-between border-b border-border py-2.5">
            <span className="text-sm">Pending reward</span>
            <span className="font-semibold text-gold">$0.00</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-sm">Claimable</span>
            <span className="font-semibold text-accent">$0.00</span>
          </div>
        </div>

        {/* CTA */}
        <button
          disabled
          className="w-full max-w-xs cursor-not-allowed rounded-full bg-accent py-3.5 text-base font-semibold text-bg opacity-50"
        >
          Watch &amp; Earn — Coming Soon
        </button>

        <p className="max-w-xs text-xs leading-relaxed text-muted">
          Turn your attention into income. Watch short videos and earn real
          cUSD — backed by ad revenue, not promises.
        </p>
      </main>
    </div>
  )
}
