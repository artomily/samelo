'use client'

import Link from 'next/link'
import Image from 'next/image'
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
          'mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5 transition-all duration-500',
          isScrolled
            ? 'border-b border-[rgba(200,241,53,0.12)] bg-[rgba(3,3,3,0.88)] backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={closeMenu}>
          <Image
            src="/logo-text.png"
            alt="Semelo"
            height={28}
            width={112}
            className="drop-shadow-[0_0_12px_rgba(200,241,53,0.35)]"
            style={{ filter: 'brightness(0) saturate(100%) invert(83%) sepia(45%) saturate(700%) hue-rotate(26deg) brightness(105%)' }}
          />
        </Link>

        {/* Desktop links */}
        <ul className="absolute inset-x-0 mx-auto hidden w-fit items-center gap-7 text-[13px] lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted transition-all duration-200 hover:text-accent hover:drop-shadow-[0_0_8px_rgba(200,241,53,0.6)] tracking-wide"
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
            className="hidden btn-neon px-4 py-2 text-[12px] font-bold uppercase tracking-widest lg:inline-flex items-center justify-center"
          >
            Open in MiniPay
          </Link>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[rgba(200,241,53,0.15)] bg-[rgba(200,241,53,0.05)] lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={17} className={cn('absolute text-accent transition-all duration-200', menuOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100')} />
            <X size={17} className={cn('absolute text-accent transition-all duration-200', menuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0')} />
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        className={cn(
          'overflow-hidden border-b border-[rgba(200,241,53,0.12)] bg-[rgba(3,3,3,0.96)] backdrop-blur-xl transition-all duration-300 lg:hidden',
          menuOpen ? 'max-h-80 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
        )}
      >
        <ul className="flex flex-col gap-1 px-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-[13px] text-muted transition-colors hover:bg-[rgba(200,241,53,0.06)] hover:text-accent"
                onClick={closeMenu}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-[rgba(200,241,53,0.1)] px-6 pt-3">
          <Link
            href="/watch"
            onClick={closeMenu}
            className="btn-neon block w-full py-2.5 text-center text-[12px] font-bold uppercase tracking-widest"
          >
            Open in MiniPay
          </Link>
        </div>
      </div>
    </nav>
  )
}
