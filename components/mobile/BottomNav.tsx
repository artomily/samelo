'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/home',        icon: '🏠', label: 'Home'       },
  { href: '/watch',       icon: '▶️',  label: 'Watch'      },
  { href: '/leaderboard', icon: '🏆', label: 'Ranks'      },
  { href: '/missions',    icon: '✅', label: 'Missions'   },
  { href: '/profile',     icon: '👤', label: 'Profile'    },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-around pb-safe">
      {NAV_ITEMS.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 py-2 px-3 min-w-[56px] transition-all ${active ? 'text-[#c8f135]' : 'text-white/40 hover:text-white/70'}`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
