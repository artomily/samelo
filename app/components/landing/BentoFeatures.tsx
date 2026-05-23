'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface BentoItem {
  title: string
  description: string
  icon: string
  colSpan?: 2
  status?: string
}

const ITEMS: BentoItem[] = [
  {
    title: 'Watch & Earn',
    description:
      'Every second you watch counts. Get rewarded in cUSD for genuine engagement — not clicks or shares.',
    icon: '▶',
    colSpan: 2,
    status: 'LIVE',
  },
  {
    title: 'Instant cUSD',
    description: 'Earnings land in your MiniPay wallet in seconds. No waiting, no minimums.',
    icon: '$',
    status: 'REAL-TIME',
  },
  {
    title: 'MiniPay Native',
    description: "Built for Celo's MiniPay. Works seamlessly on any browser too.",
    icon: '◈',
    status: 'OPTIMISED',
  },
  {
    title: 'On-chain Proof',
    description:
      'Every reward claim is settled on-chain. Transparent, verifiable, unstoppable.',
    icon: '⬡',
    colSpan: 2,
    status: 'CELO',
  },
]

function BentoCard({ item, index }: { item: BentoItem; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group glass-card relative flex flex-col gap-3 overflow-hidden p-6 transition-all duration-300',
        hovered && '-translate-y-0.5',
        item.colSpan === 2 && 'md:col-span-2'
      )}
      style={{
        boxShadow: hovered ? '0 0 32px rgba(200,241,53,0.10), inset 0 0 24px rgba(200,241,53,0.04)' : 'none',
        borderColor: hovered ? 'rgba(200,241,53,0.3)' : undefined,
      }}
    >
      {/* Dot pattern overlay on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(200,241,53,0.08) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 flex items-start justify-between gap-2">
        <span
          className="font-display text-2xl font-black text-accent leading-none"
          style={{ textShadow: '0 0 12px rgba(200,241,53,0.4)' }}
        >
          {item.icon}
        </span>
        {item.status && (
          <span className="rounded-md border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.06)] px-2 py-0.5 font-display text-[9px] font-bold tracking-[0.15em] text-accent">
            {item.status}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-semibold text-primary">{item.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted">{item.description}</p>
      </div>
    </motion.div>
  )
}

export function BentoFeatures() {
  return (
    <section className="border-b border-[rgba(200,241,53,0.08)] px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p
            className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent"
            style={{ textShadow: '0 0 12px rgba(200,241,53,0.4)' }}
          >
            Features
          </p>
          <h2 className="mt-3 font-display text-2xl font-black tracking-tight text-primary sm:text-3xl">
            Everything you need to earn
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <BentoCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
