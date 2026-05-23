'use client'

import { motion } from 'framer-motion'

const TESTIMONIALS = [
  {
    initials: 'AK',
    name: 'Amara K.',
    location: 'Lagos, Nigeria',
    quote: 'I earn $MELOUSD every morning before work. It takes five minutes and the money lands in MiniPay the same day. This is the first Web3 app that actually pays.',
  },
  {
    initials: 'RD',
    name: 'Rizal D.',
    location: 'Jakarta, Indonesia',
    quote: 'The points system keeps me coming back. I watch, I collect, I deploy — it feels like a game but the rewards are real stablecoins.',
  },
  {
    initials: 'FM',
    name: 'Fatima M.',
    location: 'Nairobi, Kenya',
    quote: "Finally a Web3 app that doesn't need me to understand crypto. I just open MiniPay, tap watch, and see my balance go up.",
  },
]

export function Testimonials() {
  return (
    <section className="relative overflow-hidden border-b border-[rgba(200,241,53,0.08)] px-5 py-20">
      {/* Glow center */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 40% 40% at 50% 50%, rgba(200,241,53,0.04) 0%, transparent 70%)' }}
      />
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent"
            style={{ textShadow: '0 0 12px rgba(200,241,53,0.4)' }}
          >
            Transmissions
          </p>
          <h2 className="mt-3 font-display text-2xl font-black tracking-tight text-primary sm:text-3xl">
            Real explorers. Real earnings.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card flex flex-col gap-4 p-5 transition-all duration-300 hover:border-[rgba(200,241,53,0.25)] hover:-translate-y-0.5"
            >
              {/* Quote marks */}
              <div className="font-display text-3xl leading-none text-accent opacity-30">&ldquo;</div>
              <p className="-mt-3 flex-1 text-sm leading-relaxed text-muted italic">{t.quote}</p>
              <div className="flex items-center gap-3 border-t border-[rgba(200,241,53,0.08)] pt-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(200,241,53,0.25)] bg-[rgba(200,241,53,0.08)] font-display text-[10px] font-black text-accent"
                  style={{ boxShadow: '0 0 12px rgba(200,241,53,0.15)' }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary">{t.name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
