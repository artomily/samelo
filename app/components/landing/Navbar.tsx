'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#earn', label: 'Earn' },
  { href: '#referral', label: 'Referral' },
  { href: '#features', label: 'Points' },
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
    <nav className="fixed inset-x-0 top-0 z-50 w-full">
      <div
        className={cn(
          'mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5 transition-all duration-300',
          isScrolled
            ? 'border-b border-border bg-bg/95 backdrop-blur-lg'
            : 'bg-transparent'
        )}
      >
        {/* Logo */}
        <Link href="/" className="text-[17px] font-medium tracking-tight text-primary" onClick={closeMenu}>
          Sem<span className="text-accent">elo</span>
        </Link>

        {/* Desktop links */}
        <ul className="absolute inset-x-0 mx-auto hidden w-fit items-center gap-7 text-[13px] lg:flex">
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
            href="/home"
            className="hidden rounded-lg bg-accent px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover lg:inline-flex"
          >
            Open in MiniPay
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu
              size={17}
              className={cn(
                'absolute transition-all duration-200',
                menuOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
              )}
            />
            <X
              size={17}
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
          'overflow-hidden border-b border-border bg-bg/98 backdrop-blur-lg transition-all duration-300 lg:hidden',
          menuOpen ? 'max-h-80 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
        )}
      >
        <ul className="flex flex-col gap-1 px-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-[13px] text-muted transition-colors hover:bg-card hover:text-primary"
                onClick={closeMenu}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-border px-6 pt-3">
          <Link
            href="/home"
            onClick={closeMenu}
            className="block w-full rounded-lg bg-accent py-2.5 text-center text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Open in MiniPay
          </Link>
        </div>
      </div>
    </nav>
  )
}
