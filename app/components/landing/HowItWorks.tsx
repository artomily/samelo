'use client'

import { useState } from 'react'
import { Smartphone, Play, Coins, ArrowLeftRight, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    Icon: Smartphone,
    title: 'Open in MiniPay',
    description:
      'Launch Samelo inside MiniPay. No wallet setup, no downloads, no seed phrases — tap and go.',
    detail: 'Built natively for Opera MiniPay on Celo. Zero friction onboarding. No KYC required — just open and start earning.',
  },
  {
    number: '02',
    Icon: Play,
    title: 'Watch Videos',
    description:
      'Browse your feed and watch short videos. Earn 5–200 points per video depending on length.',
    detail: 'Shorter clips earn less. Long-form earns more. Fair rewards for real attention — every second you watch counts toward your next payout.',
  },
  {
    number: '03',
    Icon: Coins,
    title: 'Earn Points',
    description:
      'Points accumulate as you watch. Swap your points for CELO — directly to your MiniPay wallet.',
    detail: 'Track your balance in real-time. The more you watch, the faster you stack. Minimum 500 points to swap, no hidden fees.',
  },
  {
    number: '04',
    Icon: ArrowLeftRight,
    title: 'Swap to CELO',
    description:
      'Enter your points amount and swap for CELO in a single on-chain transaction via oracle signature.',
    detail: 'No gas hacks. No complex math. Enter any amount (min 500 pts), sign once, get CELO sent directly to your wallet.',
  },
]

const REDEMPTION_TIERS = [
  { pts: '500', melo: '0.005' },
  { pts: '1K', melo: '0.01' },
  { pts: '2.5K', melo: '0.025' },
  { pts: '5K', melo: '0.05' },
  { pts: '10K', melo: '0.10' },
  { pts: '25K', melo: '0.25' },
  { pts: '50K', melo: '0.50' },
  { pts: '100K', melo: '1.00' },
]

function RedemptionPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-2xl border border-[rgba(200,241,53,0.12)] bg-[#060606] p-5"
      style={{ boxShadow: '0 0 40px rgba(200,241,53,0.05)' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent/70">
          Swap Points → CELO
        </span>
        <span className="rounded-full border border-[rgba(200,241,53,0.15)] bg-[rgba(200,241,53,0.05)] px-2.5 py-0.5 font-display text-[9px] uppercase tracking-wider text-accent/60">
          1K pts = 0.01 CELO
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {REDEMPTION_TIERS.map((tier) => (
          <div
            key={tier.pts}
            className="flex flex-col items-center rounded-xl border border-[rgba(200,241,53,0.1)] bg-[rgba(200,241,53,0.025)] px-2 py-3 text-center transition-all hover:border-[rgba(200,241,53,0.25)] hover:bg-[rgba(200,241,53,0.05)]"
          >
            <span className="font-display text-sm font-black text-accent">
              {tier.melo}
            </span>
              <span className="font-display text-[9px] uppercase tracking-wider text-white">
                CELO
              </span>
            <span className="mt-1 font-display text-[9px] text-white">
              {tier.pts} pts
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 text-center">
        <span className="font-display text-[9px] uppercase tracking-[0.15em] text-white">
          Custom amount · one-click swap
        </span>
      </div>
    </motion.div>
  )
}

export function HowItWorks() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-b border-[rgba(200,241,53,0.08)] px-5 py-20 md:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(200,241,53,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p
            className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent"
            style={{ textShadow: '0 0 12px rgba(200,241,53,0.4)' }}
          >
            How it works
          </p>
          <h2 className="mt-3 font-display text-2xl font-black tracking-tight text-primary sm:text-3xl">
            Watch. Earn. Swap.
          </h2>
          <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-muted">
            No KYC, no gas tricks. Watch videos, stack points, and swap for{' '}
            <span className="text-accent">CELO</span> right inside MiniPay.
          </p>
        </motion.div>

        {/* Grid of clickable cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {STEPS.map((step, i) => {
            const isOpen = expanded === i
            const StepIcon = step.Icon

            return (
              <motion.button
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                onClick={() => setExpanded(isOpen ? null : i)}
                className="group relative flex w-full flex-col text-left rounded-2xl border p-6 transition-all duration-300 cursor-pointer"
                style={
                  isOpen
                    ? {
                        borderColor: 'rgba(200,241,53,0.35)',
                        background: 'rgba(200,241,53,0.06)',
                        boxShadow: '0 0 32px rgba(200,241,53,0.1)',
                      }
                    : {
                        borderColor: 'rgba(200,241,53,0.1)',
                        background: 'rgba(200,241,53,0.015)',
                      }
                }
              >
                {/* Hover overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      'radial-gradient(ellipse at 30% 20%, rgba(200,241,53,0.04) 0%, transparent 60%)',
                  }}
                />

                <div className="relative z-10 flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border transition-all duration-300"
                    style={
                      isOpen
                        ? {
                            borderColor: 'rgba(200,241,53,0.4)',
                            background: 'rgba(200,241,53,0.1)',
                            boxShadow: '0 0 24px rgba(200,241,53,0.18)',
                          }
                        : {
                            borderColor: 'rgba(200,241,53,0.18)',
                            background: 'rgba(200,241,53,0.05)',
                            boxShadow: '0 0 16px rgba(200,241,53,0.06)',
                          }
                    }
                  >
                    <StepIcon size={20} className="text-accent" />
                    <span className="font-display text-[9px] font-black text-accent/50">
                      {step.number}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 pt-1">
                    <h3 className="font-display text-base font-bold text-primary sm:text-lg">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {step.description}
                    </p>

                    {/* Expandable detail */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="mt-3 text-sm leading-relaxed text-muted/50 border-t border-[rgba(200,241,53,0.08)] pt-3">
                            {step.detail}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Expand chevron */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 pt-2"
                  >
                    <ChevronDown
                      size={16}
                      className="text-muted/30 group-hover:text-accent/50 transition-colors"
                    />
                  </motion.div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Redemption preview */}
        <RedemptionPreview />
      </div>
    </section>
  )
}
