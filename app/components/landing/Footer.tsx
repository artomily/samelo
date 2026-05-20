import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '#', label: 'Docs' },
  { href: '#', label: 'Contract' },
  { href: 'https://twitter.com', label: 'Twitter' },
  { href: 'https://t.me', label: 'Telegram' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg px-5 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        {/* Logo */}
        <span className="text-[15px] font-medium text-primary">
          Sem<span className="text-accent">elo</span>
        </span>

        {/* Links */}
        <nav className="flex items-center gap-5">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-[13px] text-muted transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Legal copy */}
        <p className="text-[11px] text-muted/60">Built on Celo · Powered by MiniPay</p>
      </div>
    </footer>
  )
}
