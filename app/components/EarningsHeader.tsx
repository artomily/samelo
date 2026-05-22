'use client'

import { useTranslation } from '@/lib/i18n'
import { LanguagePicker } from '@/app/components/LanguagePicker'

/**
 * EarningsHeader - Sticky header for earnings page
 * Shows page title and language selector
 */
export function EarningsHeader() {
  const { t } = useTranslation()

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(200,241,53,0.10)] px-4 py-3"
      style={{ background: 'rgba(3,3,3,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      <h1
        className="font-display text-[13px] font-black uppercase tracking-[0.15em] text-primary"
        style={{ textShadow: '0 0 12px rgba(200,241,53,0.2)' }}
      >
        {t('earnings')}
      </h1>
      <LanguagePicker />
    </header>
  )
}
