import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '#', label: 'Docs' },
  { href: '#', label: 'Contract' },
  { href: 'https://twitter.com', label: 'Twitter' },
  { href: 'https://t.me', label: 'Telegram' },
]

export function Footer() {
  return (
    <footer className="border-t border-[rgba(200,241,53,0.08)] bg-[#030303] px-5 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5">
          <span
            className="font-display text-[15px] font-black uppercase tracking-widest text-primary"
          >
            Sem<span className="text-accent" style={{ textShadow: '0 0 10px rgba(200,241,53,0.5)' }}>elo</span>
          </span>
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
