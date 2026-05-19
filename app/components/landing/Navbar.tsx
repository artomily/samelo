'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#earnings', label: 'Earnings' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav
      data-state={menuOpen ? 'active' : undefined}
      className="group fixed inset-x-0 top-0 z-50 w-full px-3 pt-2"
    >
      <div
        className={cn(
          'mx-auto flex max-w-4xl items-center justify-between px-4 py-3 transition-all duration-300',
          isScrolled
            ? 'rounded-2xl border border-border bg-bg/80 px-4 shadow-xl backdrop-blur-lg'
            : 'bg-transparent'
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="text-sm font-bold tracking-tight text-primary">Semelo</span>
        </Link>

        {/* Desktop links — absolutely centred */}
        <ul className="absolute inset-x-0 mx-auto hidden w-fit items-center gap-6 text-sm lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted transition-colors hover:text-primary"
                onClick={closeMenu}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right slot */}
        <div className="flex items-center gap-3">
          <Link
            href="/watch"
            className="hidden rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover lg:inline-flex"
          >
            Open App
          </Link>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu
              size={18}
              className={cn(
                'absolute transition-all duration-200',
                menuOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
              )}
            />
            <X
              size={18}
              className={cn(
                'absolute transition-all duration-200',
                menuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        className={cn(
          'mx-auto mt-1 max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface px-4 shadow-2xl transition-all duration-300 lg:hidden',
          menuOpen ? 'max-h-80 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
        )}
      >
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-card hover:text-primary"
                onClick={closeMenu}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-border pt-3">
          <Link
            href="/watch"
            onClick={closeMenu}
            className="block w-full rounded-xl bg-accent py-2.5 text-center text-sm font-semibold text-bg transition-colors hover:bg-accent-hover"
          >
            Open App →
          </Link>
        </div>
      </div>
    </nav>
  )
}
