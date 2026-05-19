'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslation, type TranslationKey } from '@/lib/i18n'

const tabs: { href: string; labelKey: TranslationKey; icon: (active: boolean) => React.ReactNode }[] = [
  {
    href: '/',
    labelKey: 'home',
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <path d="M3 12L12 3l9 9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 21V12h6v9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/watch',
    labelKey: 'watch',
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <circle cx="12" cy="12" r="10" />
        <polygon fill="currentColor" points="10,8 16,12 10,16" />
      </svg>
    ),
  },
  {
    href: '/earnings',
    labelKey: 'earnings',
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 12h8M8 8h5M8 16h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/profile',
    labelKey: 'profile',
    icon: (active: boolean) => (
      <svg
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-6 w-6"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useTranslation()

  // Don't show on landing page — except we DO show it (home tab is active there)
  // Keep nav visible everywhere

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface pb-safe">
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const active = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-colors',
                active ? 'text-accent' : 'text-muted',
              )}
            >
              {tab.icon(active)}
              {t(tab.labelKey)}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
