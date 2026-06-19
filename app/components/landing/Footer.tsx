import Link from 'next/link'
import Image from 'next/image'

const FOOTER_LINKS = [
  { href: '/home', label: 'App', disabled: false },
  { href: '#', label: 'Docs', disabled: true },
  { href: 'https://github.com/artomily/samelo', label: 'GitHub', disabled: false },
  { href: '#', label: 'Twitter', disabled: true },
  { href: '#', label: 'Telegram', disabled: true },
  { href: '#', label: 'Privacy', disabled: true },
  { href: '#', label: 'Terms', disabled: true },
]

export function Footer() {
  return (
    <footer className="border-t border-[rgba(200,241,53,0.08)] bg-[#030303] px-5 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5">
          <Image
            src="/logo.png"
            alt="Semelo"
            height={20}
            width={80}
            className="opacity-90 drop-shadow-[0_0_8px_rgba(200,241,53,0.3)]"
            style={{ filter: 'brightness(0) saturate(100%) invert(83%) sepia(45%) saturate(700%) hue-rotate(26deg) brightness(105%)' }}
          />
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-5">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.disabled ? undefined : link.href}
              target={!link.disabled && link.href.startsWith('http') ? '_blank' : undefined}
              rel={!link.disabled && link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`text-[12px] transition-colors ${link.disabled ? 'cursor-default text-muted/30' : 'text-muted hover:text-accent'}`}
              title={link.disabled ? 'Coming soon' : undefined}
            >
              {link.label}
              {link.disabled && (
                <span className="ml-1.5 text-[9px] text-muted/20">soon</span>
              )}
            </a>
          ))}
        </nav>

        {/* Legal copy */}
        <p className="font-display text-[9px] uppercase tracking-widest text-muted/40">
          Built on Celo · Powered by MiniPay · © 2026 Samelo
        </p>
      </div>
    </footer>
  )
}
