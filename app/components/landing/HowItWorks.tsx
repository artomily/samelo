'use client'

import { AnimatedGroup } from '@/app/components/ui/animated-group'

const STEPS = [
  {
    number: '01',
    emoji: '▶️',
    title: 'Watch a video',
    description:
      'Open Semelo and start watching. Any video on the feed qualifies — your watch time is tracked automatically.',
    color: 'border-accent/30 bg-accent/5',
    numberColor: 'text-accent',
  },
  {
    number: '02',
    emoji: '💰',
    title: 'Earn cUSD',
    description:
      'For every minute watched, cUSD accumulates in your account. No minimum threshold.',
    color: 'border-gold/30 bg-gold/5',
    numberColor: 'text-gold',
  },
  {
    number: '03',
    emoji: '⛓️',
    title: 'Claim on-chain',
    description:
      'Hit claim anytime. Your earnings are transferred on-chain to your MiniPay wallet instantly.',
    color: 'border-border bg-surface',
    numberColor: 'text-muted',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <AnimatedGroup preset="blur-slide" className="mb-12 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-accent">How it works</p>
          <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl">
            3 steps to earning
          </h2>
        </AnimatedGroup>

        {/* Mobile: vertical stack with connector */}
        <div className="relative flex flex-col gap-0 md:hidden">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative flex gap-4">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="absolute left-5 top-10 h-full w-px border-l-2 border-dashed border-border" />
              )}

              {/* Number circle */}
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${step.color} ${step.numberColor}`}
              >
                {step.number}
              </div>

              {/* Content */}
              <div className="pb-10">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{step.emoji}</span>
                  <h3 className="text-sm font-semibold text-primary">{step.title}</h3>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: 3 columns */}
        <AnimatedGroup
          preset="blur-slide"
          className="hidden grid-cols-3 gap-4 md:grid"
        >
          {STEPS.map((step) => (
            <div
              key={step.number}
              className={`flex flex-col gap-4 rounded-2xl border p-5 ${step.color}`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold ${step.color} ${step.numberColor}`}
              >
                {step.number}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{step.emoji}</span>
                  <h3 className="text-sm font-semibold text-primary">{step.title}</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">{step.description}</p>
              </div>
            </div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  )
}
