'use client'

import Link from 'next/link'
import { AnimatedGroup } from '@/app/components/ui/animated-group'

export function CTASection() {
  return (
    <section className="px-5 py-24">
      <div className="relative mx-auto max-w-xl overflow-hidden rounded-3xl border border-border bg-surface p-8 text-center sm:p-12">
        {/* Glow */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-3xl"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(53,208,127,0.15) 0%, transparent 70%)',
          }}
        />

        <AnimatedGroup preset="blur-slide" className="flex flex-col items-center gap-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/8 px-3 py-1 text-xs font-medium text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Free to use
          </div>

          <h2 className="text-2xl font-bold text-primary sm:text-3xl">
            Start earning in 30 seconds
          </h2>

          <p className="max-w-[32ch] text-sm text-muted">
            No sign-up. No KYC. Just open the app with MiniPay and watch.
          </p>

          <Link
            href="/watch"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-bg shadow-xl shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-accent/35"
          >
            Open App
            <span aria-hidden>→</span>
          </Link>

          <p className="flex items-center gap-1.5 text-[11px] text-muted/60">
            <span className="inline-block h-3 w-3 rounded-full bg-accent/30" />
            Powered by Celo
          </p>
        </AnimatedGroup>
      </div>
    </section>
  )
}
