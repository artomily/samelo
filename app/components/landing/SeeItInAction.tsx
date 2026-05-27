'use client'

import { motion } from 'framer-motion'
import { Play, Coins, ArrowLeftRight } from 'lucide-react'

const STEPS = [
  {
    icon: Play,
    label: 'Step 1',
    title: 'Open & Watch',
    description: 'Browse your feed in MiniPay. Tap any video to start earning points immediately.',
  },
  {
    icon: Coins,
    label: 'Step 2',
    title: 'Stack Points',
    description: 'Points accumulate in real-time as you watch. Track your balance from the dashboard.',
  },
  {
    icon: ArrowLeftRight,
    label: 'Step 3',
    title: 'Swap to CELO',
    description: 'Convert points to CELO in one tap. Funds land directly in your MiniPay wallet.',
  },
]

export function SeeItInAction() {
  return (
    <section className="relative overflow-hidden border-b border-[rgba(200,241,53,0.08)] px-5 py-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,241,53,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p
            className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent"
            style={{ textShadow: '0 0 12px rgba(200,241,53,0.4)' }}
          >
            See it in action
          </p>
          <h2 className="mt-3 font-display text-2xl font-black tracking-tight text-primary sm:text-3xl">
            Three taps to CELO
          </h2>
          <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-muted">
            No complex setup. Everything happens inside MiniPay — just tap, watch, and swap.
          </p>
        </motion.div>

        {/* Phone mockup row */}
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center gap-5"
            >
              {/* Phone frame */}
              <div className="relative w-full max-w-[220px]">
                <div
                  className="overflow-hidden rounded-[24px] border border-[rgba(200,241,53,0.15)] bg-[#060606]"
                  style={{ boxShadow: '0 0 32px rgba(200,241,53,0.08)' }}
                >
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <span className="font-display text-[8px] font-bold text-muted/40">
                      9:41
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-4 rounded-full border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.08)]" />
                      <div className="h-1.5 w-1 rounded-sm bg-[rgba(200,241,53,0.2)]" />
                    </div>
                  </div>

                  {/* Screen content */}
                  <div className="flex flex-col items-center px-4 pb-5 pt-4">
                    {/* Step icon */}
                    <div
                      className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.06)]"
                      style={{ boxShadow: '0 0 20px rgba(200,241,53,0.1)' }}
                    >
                      <step.icon size={22} className="text-accent" />
                    </div>

                    {/* Video placeholder */}
                    <div className="mb-3 h-24 w-full rounded-lg border border-[rgba(200,241,53,0.1)] bg-[rgba(200,241,53,0.03)] flex items-center justify-center">
                      <Play
                        size={24}
                        className="text-accent/30"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(200,241,53,0.15))' }}
                      />
                    </div>

                    {/* Point bar */}
                    <div className="w-full rounded-lg border border-[rgba(200,241,53,0.1)] bg-[rgba(200,241,53,0.03)] px-3 py-2">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-[9px] font-bold text-muted/60">
                          Points
                        </span>
                        <span
                          className="font-display text-[10px] font-black text-accent"
                          style={{ textShadow: '0 0 8px rgba(200,241,53,0.4)' }}
                        >
                          {['+150 pts', '+320 pts', '+500 pts'][i]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="flex justify-center pb-2">
                    <div className="h-1 w-20 rounded-full bg-[rgba(200,241,53,0.12)]" />
                  </div>
                </div>
              </div>

              {/* Step text overlay */}
              <div className="text-center">
                <span className="font-display text-[9px] font-black uppercase tracking-[0.15em] text-accent/60">
                  {step.label}
                </span>
                <h3 className="mt-1 font-display text-sm font-bold text-primary">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
