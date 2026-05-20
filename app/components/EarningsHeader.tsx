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
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-sm">
      <h1 className="text-base font-bold tracking-tight">{t('earnings')}</h1>
      <LanguagePicker />
    </header>
  )
}
