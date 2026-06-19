'use client'

import { motion } from 'framer-motion'

const SEGMENTS = [
  { label: 'Rewards',    pct: 60, color: '#c8f135', description: 'Watch-to-earn & incentives' },
  { label: 'Ecosystem',  pct: 15, color: '#35d07f', description: 'Grants, integrations & DEX liquidity' },
  { label: 'Treasury',   pct: 10, color: '#fbcc5c', description: 'Protocol-controlled reserve' },
  { label: 'Team',       pct: 10, color: '#9ca3af', description: 'Core contributors (4yr vest)' },
  { label: 'Advisors',   pct:  5, color: '#6b7280', description: 'Strategic partners (2yr vest)' },
]

export function Tokenomics() {
  return (
    <section className="w-full bg-[#030303] px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-accent/70">
            Tokenomics — Active
          </p>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-primary sm:text-4xl">
            $MELO Token
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            100 million MELO — fixed supply, no inflation. Built on Celo for
            near-zero gas fees and mobile-first access. Launch details TBA.
          </p>
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(200,241,53,0.25)] bg-[rgba(200,241,53,0.08)] px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-accent/80">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Watch → earn points → swap for $MELO on Celo
            </span>
          </div>
        </motion.div>

        {/* Supply bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.85 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-8 overflow-hidden rounded-full"
          style={{ height: 18 }}
        >
          <div className="flex h-full w-full">
            {SEGMENTS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  width: `${s.pct}%`,
                  background: s.color,
                  opacity: 0.85,
                  borderRight: i < SEGMENTS.length - 1 ? '2px solid #030303' : 'none',
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Legend grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {SEGMENTS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
              className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: s.color, boxShadow: `0 0 8px ${s.color}88` }}
                />
                <span className="font-display text-[10px] font-bold uppercase tracking-widest text-primary">
                  {s.label}
                </span>
              </div>
              <p
                className="font-display text-2xl font-black tabular-nums"
                style={{ color: s.color, textShadow: `0 0 12px ${s.color}55` }}
              >
                {s.pct}%
              </p>
              <p className="mt-1 text-[11px] leading-snug text-muted">{s.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-[rgba(200,241,53,0.12)] bg-[rgba(200,241,53,0.04)] p-6 sm:grid-cols-4"
        >
          {[
            { label: 'Total Supply',  value: '100M MELO' },
            { label: 'Network',       value: 'Celo' },
            { label: 'Rate',          value: '1pt → 0.00001 CELO' },
            { label: 'Contract',      value: 'Mainnet live' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="font-display text-[9px] uppercase tracking-widest text-muted">
                {item.label}
              </p>
              <p className="mt-1 font-display text-sm font-black text-accent">
                {item.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
