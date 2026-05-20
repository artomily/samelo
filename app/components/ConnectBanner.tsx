'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { useMiniPay } from '@/hooks/useMiniPay'
import { cn } from '@/lib/utils'

/**
 * ConnectBanner - Prompts user to connect wallet when disconnected
 * Hidden when wallet is already connected
 * Includes link to open MiniPay app
 */
export function ConnectBanner({ className }: { className?: string }) {
  const { isConnected } = useMiniPay()
  const { t } = useTranslation()

  // Already connected — hide banner
  if (isConnected) return null

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3',
        className,
      )}
    >
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-accent">{t('connectToEarn')}</p>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted">
          {t('connectDesc')}
        </p>
      </div>
      <Link
        href="/"
        className="shrink-0 rounded-full bg-accent px-3 py-1.5 text-[11px] font-bold text-bg transition-opacity hover:opacity-90"
      >
        {t('connectWallet')}
      </Link>
    </div>
  )
}
