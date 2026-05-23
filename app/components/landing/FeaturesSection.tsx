'use client'

import { Coins, Shield, Bolt, Users, BarChart2, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

const FEATURES = [
  {
    Icon: Coins,
    title: 'Real Yield Engine',
    description: 'Every dollar of ad revenue is routed on-chain. You earn from actual monetisation, not from a pool that runs dry.',
    accent: true,
  },
  {
    Icon: Shield,
    title: 'On-Chain Transparency',
    description: 'All payouts are verifiable on Celo. Anyone can audit the contract — no black-box earnings.',
  },
  {
    Icon: Bolt,
    title: 'MiniPay Native',
    description: 'Built for MiniPay from day one. No external wallet, no seed phrases, instant UX.',
  },
  {
    Icon: Users,
    title: 'Referral Network',
    description: 'Invite explorers and earn a percentage of their watch rewards forever. Your network compounds.',
  },
  {
    Icon: BarChart2,
    title: 'Points Systems',
    description: 'Accumulate off-chain points as you watch, then deploy them to Celo in batches to save gas.',
  },
  {
    Icon: MapPin,
    title: 'Galaxy First',
    description: 'Designed for low-bandwidth networks and MELOUSD stability. Works everywhere MiniPay works.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden border-b border-[rgba(200,241,53,0.08)] px-5 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent"
            style={{ textShadow: '0 0 12px rgba(200,241,53,0.4)' }}
          >
            Why Samelo
          </p>
          <h2 className="mt-3 font-display text-2xl font-black tracking-tight text-primary sm:text-3xl">
            Built different, by design
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="group glass-card p-5 transition-all duration-300 hover:border-[rgba(200,241,53,0.3)] hover:-translate-y-0.5"
              style={{
                boxShadow: feat.accent ? '0 0 24px rgba(200,241,53,0.06), inset 0 0 24px rgba(200,241,53,0.03)' : 'none',
                borderColor: feat.accent ? 'rgba(200,241,53,0.25)' : undefined,
              }}
            >
              <div
                className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.06)] transition-all group-hover:shadow-[0_0_16px_rgba(200,241,53,0.2)]"
              >
                <feat.Icon size={16} className="text-accent" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-primary">{feat.title}</h3>
              <p className="text-xs leading-relaxed text-muted">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
