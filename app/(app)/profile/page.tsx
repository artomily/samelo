'use client'

import { useTranslation } from '@/lib/i18n'
import { useMiniPay } from '@/hooks/useMiniPay'
import Link from 'next/link'

export default function ProfilePage() {
  const { t } = useTranslation()
  const { isConnected, address, connectMiniPay, isConnecting } = useMiniPay()

  return (
    <div className="flex min-h-dvh flex-col bg-[#030303] text-primary">
      {/* Header */}
      <header
        className="sticky top-0 left-0 right-0 z-30 flex items-center border-b border-[rgba(200,241,53,0.10)] px-4 py-3 sm:px-7 sm:py-3.5"
        style={{ background: 'rgba(3,3,3,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <h1 className="font-display text-[13px] font-black uppercase tracking-[0.15em] text-primary"
          style={{ textShadow: '0 0 10px rgba(200,241,53,0.2)' }}>
          Profile
        </h1>
      </header>

      <div className="w-full overflow-hidden px-4 py-4 pb-20 sm:px-7 sm:py-5">
        {isConnected ? (
          <>
            {/* Wallet card */}
            <div className="rounded-2xl border border-[rgba(200,241,53,0.12)] bg-[#0d0d0d] p-5 mb-4">
              <p className="mb-1 font-display text-[9px] uppercase tracking-widest text-muted">Wallet</p>
              <p className="break-all font-mono text-sm text-primary">{address}</p>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl border border-[rgba(200,241,53,0.12)] bg-[#0d0d0d] divide-y divide-[rgba(200,241,53,0.06)] overflow-hidden">
              <Link
                href="/watch"
                className="flex items-center justify-between px-5 py-4 text-sm text-primary hover:bg-[rgba(200,241,53,0.04)] transition-colors"
              >
                <span>Watch</span>
                <span className="text-muted">→</span>
              </Link>
              <Link
                href="/earnings"
                className="flex items-center justify-between px-5 py-4 text-sm text-primary hover:bg-[rgba(200,241,53,0.04)] transition-colors"
              >
                <span>Earnings</span>
                <span className="text-muted">→</span>
              </Link>
            </div>
          </>
        ) : (
          /* Not connected */
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-[rgba(200,241,53,0.12)] bg-[#0d0d0d] px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-2xl">
              👤
            </div>
            <div>
              <p className="font-semibold text-primary">Connect to Earn</p>
              <p className="mt-1 text-xs text-muted">Connect your wallet to start earning rewards</p>
            </div>
            <button
              onClick={connectMiniPay}
              disabled={isConnecting}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isConnecting ? '…' : 'Connect Wallet'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
