'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AnimatedGroup } from '@/app/components/ui/animated-group'

interface BentoItem {
  title: string
  description: string
  icon: string
  colSpan?: 2
  status?: string
  statusColor?: string
}

const ITEMS: BentoItem[] = [
  {
    title: 'Watch & Earn',
    description:
      'Every second you watch counts. Get rewarded in cUSD for genuine engagement — not clicks or shares.',
    icon: '▶️',
    colSpan: 2,
    status: 'Live',
    statusColor: 'text-accent',
  },
  {
    title: 'Instant cUSD',
    description: 'Earnings land in your MiniPay wallet in seconds. No waiting, no minimums.',
    icon: '💸',
    status: 'Real-time',
    statusColor: 'text-gold',
  },
  {
    title: 'MiniPay Native',
    description: 'Built for Celo\'s MiniPay. Works seamlessly on any browser too.',
    icon: '📱',
    status: 'Optimised',
    statusColor: 'text-muted',
  },
  {
    title: 'On-chain Proof',
    description:
      'Every reward claim is settled on-chain. Transparent, verifiable, unstoppable.',
    icon: '⛓️',
    colSpan: 2,
    status: 'Celo',
    statusColor: 'text-accent',
  },
]

function DotPattern({ className }: { className?: string }) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100', className)}
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(53,208,127,0.15) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    />
  )
}

function BentoCard({ item }: { item: BentoItem }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all duration-300',
        hovered && '-translate-y-0.5 border-accent/40 shadow-lg shadow-accent/5',
        item.colSpan === 2 && 'md:col-span-2'
      )}
    >
      {/* Gradient border inset on hover */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 -z-10',
          hovered && 'opacity-100'
        )}
        style={{
          background: 'linear-gradient(135deg, rgba(53,208,127,0.08), transparent)',
        }}
      />
      <DotPattern />

      <div className="relative z-10 flex items-start justify-between gap-2">
        <span className="text-2xl" role="img">
          {item.icon}
        </span>
        {item.status && (
          <span className={cn('rounded-lg bg-black/20 px-2 py-0.5 text-xs font-medium', item.statusColor)}>
            {item.status}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-semibold text-primary">{item.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted">{item.description}</p>
      </div>
    </div>
  )
}

export function BentoFeatures() {
  return (
    <section id="features" className="px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <AnimatedGroup preset="blur-slide" className="mb-10 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-accent">Features</p>
          <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl">
            Everything you need to earn
          </h2>
        </AnimatedGroup>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {ITEMS.map((item) => (
            <BentoCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
