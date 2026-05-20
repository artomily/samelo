'use client'

import Link from 'next/link'

export function CTASection() {
  return (
    <section className="border-b border-border bg-surface px-7 py-13 text-center">
      <div className="flex flex-col items-center gap-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">
          Start earning today
        </p>

        <h2 className="text-2xl font-bold text-primary sm:text-3xl">
          Ready to watch and earn?
        </h2>

        <p className="mt-1 max-w-[38ch] text-sm leading-relaxed text-muted">
          Join real users earning cUSD on Celo today. No sign-up required.
        </p>

        <Link
          href="/watch"
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 text-[15px] font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover"
        >
          Open in MiniPay
        </Link>
      </div>
    </section>
  )
}
