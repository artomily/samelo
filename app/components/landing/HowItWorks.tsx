'use client'

import { Smartphone, Play, Zap, Gift } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    Icon: Smartphone,
    title: 'Open in MiniPay',
    description: 'Launch Samelo inside MiniPay — no wallet setup, no downloads, no KYC.',
  },
  {
    number: '02',
    Icon: Play,
    title: 'Watch content',
    description: 'Watch any video in the feed. Every completed video earns you pending points.',
  },
  {
    number: '03',
    Icon: Zap,
    title: 'Deploy points',
    description: 'Batch your off-chain points and deploy them to the Celo blockchain in one tap.',
  },
  {
    number: '04',
    Icon: Gift,
    title: 'Claim rewards',
    description: 'Convert deployed points to real cUSD and withdraw straight to your wallet.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border px-7 py-13">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-accent">How it works</p>
          <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl">
            4 steps to your first payout
          </h2>
        </div>

        {/* Steps grid */}
        <div className="relative grid gap-4 md:grid-cols-4 md:gap-0">
          {STEPS.map((step, i) => {
            const isLast = i === STEPS.length - 1
            return (
              <div key={step.number} className="relative flex flex-col items-start md:items-center md:text-center">
                {/* Desktop connector arrow */}
                {!isLast && (
                  <div className="absolute right-0 top-5 hidden translate-x-1/2 -translate-y-1/2 text-border md:block">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10h12M12 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted/30"/>
                    </svg>
                  </div>
                )}

                {/* Mobile connector */}
                {!isLast && (
                  <div className="absolute left-5 top-10 h-full w-px bg-border md:hidden" />
                )}

                {/* Card */}
                <div className="relative z-10 flex w-full flex-row gap-4 rounded-xl border border-border bg-card p-4 md:flex-col md:gap-3 md:rounded-none md:border-0 md:bg-transparent md:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/8">
                    <step.Icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="mb-1 text-[11px] font-bold tracking-widest text-accent">{step.number}</p>
                    <h3 className="text-sm font-semibold text-primary">{step.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">{step.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
