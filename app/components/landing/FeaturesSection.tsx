'use client'

import { Coins, Shield, Bolt, Users, BarChart2, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

const FEATURES = [
  {
    Icon: Coins,
    title: 'Real yield model',
    description:
      'Every dollar of ad revenue is routed on-chain. You earn from actual monetisation, not from a reward pool that could run dry.',
    accent: true,
  },
  {
    Icon: Shield,
    title: 'On-chain transparency',
    description:
      'All payouts are verifiable on Celo. Anyone can audit the contract — no black-box earnings.',
  },
  {
    Icon: Bolt,
    title: 'MiniPay native',
    description:
      'Built for MiniPay from day one. No external wallet required, no seed phrases, instant UX.',
  },
  {
    Icon: Users,
    title: 'Referral rewards',
    description:
      'Invite friends and earn a percentage of their watch rewards forever. Your network compounds.',
  },
  {
    Icon: BarChart2,
    title: 'Points system',
    description:
      'Accumulate off-chain points as you watch, then deploy them to the blockchain in batches to save gas.',
  },
  {
    Icon: MapPin,
    title: 'Emerging market first',
    description:
      'Designed for low-bandwidth networks and cUSD stability. Works everywhere MiniPay works.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-b border-border px-7 py-13">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-accent">Why Samelo</p>
          <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl">
            Built different, by design
          </h2>
        </div>

        {/* 6-card grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className={cn(
                'rounded-xl border p-5 transition-colors',
                feat.accent
                  ? 'border-accent/30 bg-accent/5'
                  : 'border-border bg-card hover:border-border/80 hover:bg-card/80'
              )}
            >
              <div
                className={cn(
                  'mb-4 flex h-9 w-9 items-center justify-center rounded-lg',
                  feat.accent
                    ? 'bg-accent/15 text-accent'
                    : 'bg-surface text-muted'
                )}
              >
                <feat.Icon size={16} />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-primary">{feat.title}</h3>
              <p className="text-xs leading-relaxed text-muted">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
