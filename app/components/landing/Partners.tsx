'use client'

import { motion } from 'framer-motion'

const PARTNERS = [
  {
    name: 'Celo',
    description: 'Mobile-first L1 blockchain',
    icon: (
      <svg viewBox="0 0 120 120" className="h-10 w-10" fill="none">
        <circle cx="60" cy="60" r="56" stroke="rgba(200,241,53,0.3)" strokeWidth="2" />
        <circle cx="60" cy="60" r="48" stroke="rgba(200,241,53,0.15)" strokeWidth="1" strokeDasharray="4 4" />
        <text x="60" y="68" textAnchor="middle" fill="#c8f135" fontSize="28" fontWeight="900" fontFamily="Orbitron, monospace">C</text>
      </svg>
    ),
  },
  {
    name: 'MiniPay',
    description: 'Built-in stablecoin wallet',
    icon: (
      <svg viewBox="0 0 120 120" className="h-10 w-10" fill="none">
        <rect x="28" y="36" width="64" height="48" rx="12" stroke="rgba(200,241,53,0.3)" strokeWidth="2" />
        <rect x="36" y="44" width="48" height="32" rx="6" stroke="rgba(200,241,53,0.15)" strokeWidth="1" />
        <circle cx="60" cy="60" r="8" fill="#c8f135" opacity="0.6" />
      </svg>
    ),
  },
  {
    name: 'Opera',
    description: 'Browser with built-in crypto',
    icon: (
      <svg viewBox="0 0 120 120" className="h-10 w-10" fill="none">
        <circle cx="60" cy="60" r="52" stroke="rgba(200,241,53,0.3)" strokeWidth="2" />
        <circle cx="60" cy="60" r="38" stroke="rgba(200,241,53,0.15)" strokeWidth="1" />
        <circle cx="60" cy="60" r="22" stroke="rgba(200,241,53,0.3)" strokeWidth="2" />
        <circle cx="60" cy="60" r="10" fill="#c8f135" opacity="0.5" />
      </svg>
    ),
  },
]

export function Partners() {
  return (
    <section className="relative overflow-hidden border-b border-[rgba(200,241,53,0.08)] px-5 py-16">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center font-display text-[10px] font-bold uppercase tracking-[0.2em] text-muted"
        >
          Built on
        </motion.p>

        <div className="flex items-center justify-center gap-10 sm:gap-16">
          {PARTNERS.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center gap-2"
            >
              {partner.icon}
              <span className="font-display text-[10px] font-bold uppercase tracking-widest text-primary">
                {partner.name}
              </span>
              <span className="text-[10px] text-muted">{partner.description}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
