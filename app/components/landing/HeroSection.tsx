'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatedGroup } from '@/app/components/ui/animated-group'
import { TextEffect } from '@/app/components/ui/text-effect'

function Counter({ target, prefix = '' }: { target: number; prefix?: string }) {
  const [value, setVal] = useState(0)
  useEffect(() => {
    let raf: number
    const start = performance.now()
    const duration = 1600
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.floor(ease * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return (
    <span>
      {prefix}
      {value.toLocaleString()}
    </span>
  )
}

const STATS = [
  { label: 'Viewers', value: 48320, prefix: '' },
  { label: 'cUSD Paid', value: 12850, prefix: '$' },
  { label: 'Videos', value: 3400, prefix: '' },
]

export function HeroSection() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-28 text-center">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(53,208,127,0.12) 0%, transparent 70%)',
        }}
      />

      <AnimatedGroup preset="blur-slide" className="flex flex-col items-center gap-5">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-4 py-1.5 text-xs font-medium text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Now live on Celo
        </div>

        {/* Headline */}
        <h1 className="max-w-[18ch] text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl lg:text-6xl">
          <TextEffect preset="blur" per="word">
            Watch Videos. Earn Crypto.
          </TextEffect>
        </h1>

        {/* Sub */}
        <p className="max-w-[38ch] text-base text-muted sm:text-lg">
          Semelo pays you real cUSD for every video you watch — directly to your MiniPay wallet.
          .No middleman.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/watch"
            className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold text-bg shadow-lg shadow-accent/20 transition-colors hover:bg-accent-hover"
          >
            Start Watching →
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3 text-sm font-medium text-muted transition-colors hover:border-primary hover:text-primary"
          >
            How it works
          </a>
        </div>
      </AnimatedGroup>

      {/* Stats row */}
      <div className="mt-16 grid w-full max-w-sm grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-surface px-2 py-5 sm:max-w-md">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-0.5 px-3">
            <span className="text-xl font-bold tabular-nums text-primary sm:text-2xl">
              <Counter target={s.value} prefix={s.prefix} />
            </span>
            <span className="text-[11px] text-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
