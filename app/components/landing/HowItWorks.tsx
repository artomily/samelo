'use client'

import { Smartphone, Play, Zap, Gift } from 'lucide-react'
import { motion } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    Icon: Smartphone,
    title: 'Open in MiniPay',
    description: 'Launch Samelo inside MiniPay — no wallet setup, no downloads, no KYC. You are ready for launch.',
  },
  {
    number: '02',
    Icon: Play,
    title: 'Watch & Explore',
    description: 'Navigate your cosmic feed. Every completed video earns you stellar points.',
  },
  {
    number: '03',
    Icon: Zap,
    title: 'Deploy Points',
    description: 'Batch your off-chain points and deploy them to the Celo blockchain in one tap.',
  },
  {
    number: '04',
    Icon: Gift,
    title: 'Claim Rewards',
    description: 'Convert deployed points to real cUSD and withdraw straight to your MiniPay wallet.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden border-b border-[rgba(200,241,53,0.08)] px-5 py-20">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(200,241,53,0.04) 0%, transparent 70%)' }}
      />

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent"
            style={{ textShadow: '0 0 12px rgba(200,241,53,0.4)' }}
          >
            Mission briefing
          </p>
          <h2 className="mt-3 font-display text-2xl font-black tracking-tight text-primary sm:text-3xl">
            4 steps to your first reward
          </h2>
        </div>

        {/* Steps grid */}
        <div className="relative grid gap-4 md:grid-cols-4 md:gap-0">
          {STEPS.map((step, i) => {
            const isLast = i === STEPS.length - 1
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col items-start md:items-center md:text-center"
              >
                {/* Connector line (desktop) */}
                {!isLast && (
                  <div className="absolute right-0 top-5 hidden translate-x-1/2 md:block">
                    <svg width="24" height="2" viewBox="0 0 24 2" fill="none">
                      <line x1="0" y1="1" x2="24" y2="1" stroke="rgba(200,241,53,0.25)" strokeWidth="1" strokeDasharray="3 3" />
                    </svg>
                  </div>
                )}

                {/* Connector line (mobile) */}
                {!isLast && (
                  <div className="absolute left-5 top-12 h-full w-px bg-gradient-to-b from-[rgba(200,241,53,0.25)] to-transparent md:hidden" />
                )}

                {/* Card */}
                <div
                  className="glass-card relative z-10 flex w-full flex-row gap-4 p-4 transition-all duration-300 hover:border-[rgba(200,241,53,0.3)] md:flex-col md:gap-3 md:rounded-none md:border-0 md:bg-transparent md:shadow-none md:p-5"
                  style={{ boxShadow: 'none' }}
                >
                  {/* Icon */}
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(200,241,53,0.25)] bg-[rgba(200,241,53,0.06)]"
                    style={{ boxShadow: '0 0 16px rgba(200,241,53,0.1)' }}
                  >
                    <step.Icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="mb-1 font-display text-[10px] font-bold uppercase tracking-[0.15em] text-accent">{step.number}</p>
                    <h3 className="text-sm font-semibold text-primary">{step.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
