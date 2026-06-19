'use client'

import { motion } from 'framer-motion'

const FLOW_STEPS = [
  {
    layer: 'WEB2',
    title: 'YouTube / Ad Network',
    description: 'Advertisers pay CPM to feature videos on Samelo. Revenue collected in USD.',
    color: 'rgba(255,100,100,0.15)',
    borderColor: 'rgba(255,100,100,0.3)',
    textColor: '#ff6464',
    icon: '▶',
    detail: 'Ad spend',
    amount: '$CPM',
  },
  {
    layer: 'BRIDGE',
    title: 'Samelo Treasury',
    description: 'USD converted to CELO stablecoin. Smart contract holds and distributes rewards based on verified watch events.',
    color: 'rgba(251,204,92,0.10)',
    borderColor: 'rgba(251,204,92,0.3)',
    textColor: '#fbcc5c',
    icon: '◈',
    detail: 'Smart contract',
    amount: 'CUSD',
  },
  {
    layer: 'WEB3',
    title: 'Points → $MELO',
    description: 'Oracle signs each claim. User swaps points on-chain. $MELO lands directly in their MiniPay wallet.',
    color: 'rgba(200,241,53,0.10)',
    borderColor: 'rgba(200,241,53,0.3)',
    textColor: '#c8f135',
    icon: '$',
    detail: 'Your wallet',
    amount: '$MELO',
  },
]

export function MoneyFlowSection() {
  return (
    <section className="relative overflow-hidden border-b border-[rgba(200,241,53,0.08)] px-5 py-20">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent/70">
            Transparent Money Flow
          </p>
          <h2 className="font-display text-2xl font-black tracking-tight text-primary sm:text-3xl">
            From Ad Revenue to Your Wallet
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted">
            Every dollar advertisers spend flows on-chain — verifiable, traceable, unstoppable.
            No black box. No middleman taking a secret cut.
          </p>
        </motion.div>

        {/* Flow diagram */}
        <div className="relative flex flex-col items-center gap-0">
          {FLOW_STEPS.map((step, i) => (
            <div key={step.layer} className="w-full max-w-xl flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="w-full rounded-2xl border p-5 flex items-center gap-4"
                style={{ background: step.color, borderColor: step.borderColor }}
              >
                {/* Icon */}
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-black"
                  style={{ background: step.borderColor, color: step.textColor }}
                >
                  {step.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-display text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: step.borderColor, color: step.textColor }}
                    >
                      {step.layer}
                    </span>
                    <span className="text-xs font-semibold text-white">{step.title}</span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">{step.description}</p>
                </div>

                {/* Amount badge */}
                <div className="shrink-0 text-right">
                  <p className="font-mono text-lg font-black" style={{ color: step.textColor, textShadow: `0 0 12px ${step.textColor}` }}>
                    {step.amount}
                  </p>
                  <p className="text-[10px] text-white/30">{step.detail}</p>
                </div>
              </motion.div>

              {/* Arrow connector */}
              {i < FLOW_STEPS.length - 1 && (
                <div className="flex flex-col items-center py-2">
                  <div className="h-8 w-px bg-gradient-to-b from-[rgba(200,241,53,0.3)] to-[rgba(200,241,53,0.05)]" />
                  <svg width="16" height="8" viewBox="0 0 16 8" className="text-accent/40" fill="currentColor">
                    <path d="M8 8L0 0h16L8 8z" />
                  </svg>
                  <p className="text-[9px] text-white/20 font-display uppercase tracking-widest mt-1">on-chain</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Verifiable note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-3 text-center"
        >
          <div className="h-px flex-1 bg-[rgba(200,241,53,0.08)]" />
          <p className="text-[11px] text-muted/50 px-3">
            All transactions verifiable on{' '}
            <a
              href="https://celoscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent/70 underline underline-offset-2 hover:text-accent"
            >
              Celoscan
            </a>
          </p>
          <div className="h-px flex-1 bg-[rgba(200,241,53,0.08)]" />
        </motion.div>
      </div>
    </section>
  )
}
