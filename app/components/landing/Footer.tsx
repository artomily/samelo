import Link from 'next/link'
import Image from 'next/image'

const FOOTER_LINKS = [
  { href: '#', label: 'Docs' },
  { href: '#', label: 'Contract' },
  { href: 'https://twitter.com/samelo', label: 'Twitter' },
  { href: 'https://t.me/samelo', label: 'Telegram' },
  { href: 'https://github.com/artomily/samelo', label: 'GitHub' },
  { href: '#', label: 'Privacy' },
  { href: '#', label: 'Terms' }
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
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-[12px] text-muted transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Legal copy */}
        <p className="font-display text-[9px] uppercase tracking-widest text-muted/40">
          Built on Celo · Powered by MiniPay
        </p>
      </div>
    </footer>
  )
}
