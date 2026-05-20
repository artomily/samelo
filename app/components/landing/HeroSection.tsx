'use client'

import Link from 'next/link'

const STATS = [
  { value: '$0.05', label: 'Per video' },
  { value: '24h', label: 'Instant payout' },
  { value: 'cUSD', label: 'Stablecoin' },
  { value: '0', label: 'Setup friction' },
]

export function HeroSection() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-28 text-center">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(225,29,29,0.10) 0%, transparent 65%)',
        }}
      />

      <div className="flex flex-col items-center gap-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-4 py-1.5 text-xs font-medium text-accent">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Live on Celo · MiniPay Native
        </div>

        {/* Headline */}
        <h1 className="max-w-[22ch] text-4xl font-bold leading-[1.15] tracking-tight text-primary sm:text-5xl lg:text-[56px]">
          Watch content.{' '}
          <em className="not-italic text-accent">Earn real money.</em>{' '}
          No complexity.
        </h1>

        {/* Sub */}
        <p className="max-w-[42ch] text-base leading-relaxed text-muted sm:text-lg">
          Samelo routes ad revenue on-chain so every video you finish puts real cUSD in your MiniPay wallet.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/watch"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-colors hover:bg-accent-hover"
          >
            Start Earning
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-lg border border-border px-7 py-3 text-sm font-medium text-muted transition-colors hover:border-primary/50 hover:text-primary"
          >
            How it works
          </a>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-border pt-8">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-[22px] font-medium text-primary">{s.value}</p>
            <p className="mt-0.5 text-[12px] text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
