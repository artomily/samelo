'use client'

import { useEffect } from 'react'
import { useMiniPay } from '@/hooks/useMiniPay'
import { useTranslation } from '@/lib/i18n'

/**
 * ConnectGuard - Wrapper component ensuring wallet connection
 * Handles MiniPay auto-connection, loading states, and fallback UI
 * Only renders children when wallet is properly connected
 */
export function ConnectGuard({ children }: { children: React.ReactNode }) {
  const { isConnected, isMiniPay, isConnecting, connectMiniPay } = useMiniPay()
  const { t } = useTranslation()

  // Auto-connect when running inside MiniPay
  useEffect(() => {
    if (isMiniPay && !isConnected && !isConnecting) {
      connectMiniPay()
    }
  }, [isMiniPay, isConnected, isConnecting, connectMiniPay])

  // Not in MiniPay — show deep-link prompt
  if (isMiniPay === false) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="text-7xl">📱</div>
        <div>
          <h1 className="mb-2 text-2xl font-bold">{t('openInMinipay')}</h1>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            {t('openMinipayDesc')}
          </p>
        </div>
        <a
          href="minipay://open?url=https://semelo.xyz"
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition-opacity hover:opacity-90 active:opacity-75"
        >
          {t('openMinipayButton')}
        </a>
      </div>
    )
  }

  // Detecting or connecting — show spinner
  if (isMiniPay === null || (isMiniPay && !isConnected)) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
