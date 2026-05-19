'use client'

import { useTranslation, type Locale } from '@/lib/i18n'

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'sw', label: 'SW' },
  { value: 'es', label: 'ES' },
]

export function LanguagePicker() {
  const { locale, setLocale } = useTranslation()

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5">
      {LOCALES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setLocale(value)}
          className={`rounded-md px-2 py-1 text-[11px] font-bold transition-colors ${
            locale === value
              ? 'bg-accent text-bg'
              : 'text-muted hover:text-fg'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
