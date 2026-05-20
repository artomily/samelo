'use client'

import { useTranslation } from '@/lib/i18n'
import { useMiniPay } from '@/hooks/useMiniPay'
import Link from 'next/link'

export default function ProfilePage() {
  const { t } = useTranslation()
  const { isConnected, address, connectMiniPay, isConnecting } = useMiniPay()

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-primary">
      {/* Header */}
      <div className="border-b border-border px-5 py-4">
        <h1 className="text-lg font-bold">{t('profile')}</h1>
      </div>

      <div className="mx-auto w-full max-w-lg space-y-4 px-4 py-6 pb-24">
        {isConnected ? (
          <>
            {/* Wallet card */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="mb-1 text-xs text-muted">Wallet</p>
              <p className="break-all font-mono text-sm text-primary">{address}</p>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl border border-border bg-surface divide-y divide-border overflow-hidden">
              <Link
                href="/watch"
                className="flex items-center justify-between px-5 py-4 text-sm text-primary hover:bg-card transition-colors"
              >
                <span>{t('watch')}</span>
                <span className="text-muted">→</span>
              </Link>
              <Link
                href="/earnings"
                className="flex items-center justify-between px-5 py-4 text-sm text-primary hover:bg-card transition-colors"
              >
                <span>{t('earnings')}</span>
                <span className="text-muted">→</span>
              </Link>
            </div>
          </>
        ) : (
          /* Not connected */
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-surface px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-2xl">
              👤
            </div>
            <div>
              <p className="font-semibold text-primary">{t('connectToEarn')}</p>
              <p className="mt-1 text-xs text-muted">{t('connectDesc')}</p>
            </div>
            <button
              onClick={connectMiniPay}
              disabled={isConnecting}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isConnecting ? '…' : t('connectWallet')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
