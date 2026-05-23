'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlayCircle, TrendingUp, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation, type TranslationKey } from '@/lib/i18n'

const tabs: { href: string; labelKey: TranslationKey; icon: (active: boolean) => React.ReactNode }[] = [
  {
    href: '/home',
    labelKey: 'home',
    icon: (active: boolean) => <Home size={22} strokeWidth={active ? 2.5 : 1.5} />,
  },
  {
    href: '/watch',
    labelKey: 'watch',
    icon: (active: boolean) => <PlayCircle size={22} strokeWidth={active ? 2.5 : 1.5} />,
  },
  {
    href: '/earnings',
    labelKey: 'earnings',
    icon: (active: boolean) => <TrendingUp size={22} strokeWidth={active ? 2.5 : 1.5} />,
  },
  {
    href: '/profile',
    labelKey: 'profile',
    icon: (active: boolean) => <User size={22} strokeWidth={active ? 2.5 : 1.5} />,
  },
]

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useTranslation()

  // Don't show on landing page — except we DO show it (home tab is active there)
  // Keep nav visible everywhere

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[rgba(200,241,53,0.10)] pb-safe"
      style={{ background: 'rgba(3,3,3,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const active =
            pathname === tab.href ||
            (tab.href !== '/home' && pathname.startsWith(`${tab.href}/`))
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-colors',
                active ? 'text-accent' : 'text-muted hover:text-primary',
              )}
            >
              {active && (
                <span
                  className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-accent"
                  style={{ boxShadow: '0 0 8px rgba(200,241,53,0.8)' }}
                />
              )}
              {tab.icon(active)}
              <span
                className="font-display text-[9px] uppercase tracking-widest"
                style={active ? { textShadow: '0 0 8px rgba(200,241,53,0.4)' } : {}}
              >
                {t(tab.labelKey)}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
