'use client'

import { useTranslation } from '@/lib/i18n'

export function EarningsHeader() {
  const { t } = useTranslation()

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-start border-b border-[rgba(200,241,53,0.10)] px-4 py-3 sm:px-7 sm:py-3.5"
      style={{ background: 'rgba(3,3,3,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      <h1
        className="font-display text-[13px] font-black uppercase tracking-[0.15em] text-primary"
        style={{ textShadow: '0 0 12px rgba(200,241,53,0.2)' }}
      >
        {t('earnings')}
      </h1>
    </header>
  )
}
