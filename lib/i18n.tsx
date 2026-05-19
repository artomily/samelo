'use client'

import { useState, useEffect, useContext, createContext, useCallback } from 'react'
import en from '@/i18n/en.json'
import sw from '@/i18n/sw.json'
import es from '@/i18n/es.json'

export type Locale = 'en' | 'sw' | 'es'
export type TranslationKey = keyof typeof en

const DICTIONARIES: Record<Locale, typeof en> = { en, sw, es }
const STORAGE_KEY = 'semelo_locale'
const SUPPORTED: Locale[] = ['en', 'sw', 'es']

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && SUPPORTED.includes(stored)) return stored
  } catch {
    // localStorage unavailable
  }
  const lang = navigator.language.split('-')[0] as Locale
  return SUPPORTED.includes(lang) ? lang : 'en'
}

interface I18nContext {
  locale: Locale
  t: (key: TranslationKey) => string
  setLocale: (l: Locale) => void
}

const Ctx = createContext<I18nContext>({
  locale: 'en',
  t: (key) => en[key],
  setLocale: () => {},
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    setLocaleState(detectLocale())
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      // ignore
    }
  }, [])

  const t = useCallback(
    (key: TranslationKey): string => DICTIONARIES[locale][key] ?? en[key],
    [locale],
  )

  return <Ctx.Provider value={{ locale, t, setLocale }}>{children}</Ctx.Provider>
}

export function useTranslation() {
  return useContext(Ctx)
}
