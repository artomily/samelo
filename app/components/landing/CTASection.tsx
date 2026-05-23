'use client'

import Link from 'next/link'
import { StarField } from '@/app/components/ui/StarField'

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-b border-[rgba(200,241,53,0.08)] px-5 py-24 text-center">
      {/* Stars */}
      <StarField count={60} />

      {/* Neon glow core */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(200,241,53,0.10) 0%, rgba(200,241,53,0.03) 40%, transparent 70%)',
        }}
      />

      {/* Orbit rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute h-[300px] w-[300px] rounded-full border border-[rgba(200,241,53,0.08)] animate-orbit-slow" />
        <div className="absolute h-[500px] w-[500px] rounded-full border border-[rgba(200,241,53,0.04)] animate-orbit-rev" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5">
        <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent"
          style={{ textShadow: '0 0 12px rgba(200,241,53,0.5)' }}
        >
          Start earning today
        </p>

        <h2 className="font-display text-3xl font-black tracking-tight text-primary sm:text-4xl">
          Ready to earn $MELOUSD?
        </h2>

        <p className="max-w-[34ch] text-sm leading-relaxed text-muted">
          Join thousands of users already earning $MELOUSD. Start watching today.
        </p>

        <Link
          href="/watch"
          className="btn-neon mt-4 inline-flex items-center gap-2 px-10 py-4 text-[13px]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#030303] animate-pulse" />
          Start Watching
        </Link>

        <p className="text-[11px] text-muted/50">No sign-up required · Live on Celo</p>
      </div>
    </section>
  )
}
