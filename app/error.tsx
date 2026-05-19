'use client'

import { useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()

  useEffect(() => {
    // Log to error reporting service in production
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 p-8 text-center">
      <span className="text-5xl">⚠️</span>
      <div>
        <h2 className="mb-1 text-lg font-bold">{t('errorTitle')}</h2>
        <p className="text-sm text-muted">{t('errorDesc')}</p>
      </div>
      <button
        onClick={reset}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
      >
        {t('tryAgain')}
      </button>
    </div>
  )
}
