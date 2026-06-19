'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const METRICS = [
  { label: 'Watch Events', value: 'Web2', icon: '▶', color: 'rgba(255,100,100,0.6)' },
  { label: 'Points Issued', value: 'Off-chain', icon: '◈', color: 'rgba(251,204,92,0.6)' },
  { label: 'Oracle Signed', value: 'Bridge', icon: '⬡', color: 'rgba(53,208,127,0.6)' },
  { label: '$MELO Minted', value: 'On-chain', icon: '$', color: 'rgba(200,241,53,0.9)' },
]

export function DashboardTeaser() {
  return (
    <section className="relative overflow-hidden border-b border-[rgba(200,241,53,0.08)] px-5 py-16">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-8 rounded-2xl border border-[rgba(200,241,53,0.15)] bg-[rgba(200,241,53,0.03)] p-6 sm:p-8"
        >
          {/* Left */}
          <div className="flex-1 min-w-0 space-y-3">
            <p className="font-display text-[9px] font-bold uppercase tracking-[0.2em] text-accent/60">
              Full Transparency
            </p>
            <h3 className="font-display text-xl font-black tracking-tight text-primary sm:text-2xl">
              On-Chain Dashboard
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Track every dollar flowing from advertiser → treasury → your wallet in real-time.
              No black box. Every transaction verifiable on Celo.
            </p>
            <Link
              href="/onchain"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(200,241,53,0.3)] bg-[rgba(200,241,53,0.07)] px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-accent hover:bg-[rgba(200,241,53,0.12)] transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#c8f135] animate-pulse" />
              View Live Dashboard
            </Link>
          </div>

          {/* Right — mini flow diagram */}
          <div className="flex flex-col gap-2 shrink-0">
            {METRICS.map((m, i) => (
              <div key={m.label} className="flex items-center gap-2">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: m.color + '20', color: m.color, border: `1px solid ${m.color}40` }}
                >
                  {m.icon}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white">{m.label}</p>
                  <p className="text-[9px] text-white/30 uppercase tracking-wide">{m.value}</p>
                </div>
                {i < METRICS.length - 1 && (
                  <div className="absolute left-4 mt-8">
                    <div className="h-4 w-px bg-[rgba(200,241,53,0.2)] ml-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
