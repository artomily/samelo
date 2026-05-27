'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'Is Samelo really free?',
    a: 'Yes. No sign-up fees, no deposits, no hidden costs. You start earning as soon as you watch your first video inside MiniPay.',
  },
  {
    q: 'Where does the money come from?',
    a: 'Advertisers and sponsors pay to feature their videos on Samelo. A share of every ad dollar is routed on-chain directly to viewers. No Ponzi mechanics — real monetisation powers real rewards.',
  },
  {
    q: 'Do I need a crypto wallet?',
    a: 'No external wallet required. Samelo runs inside Opera MiniPay, which gives you a built-in Celo wallet. Just open MiniPay, tap Samelo, and start watching.',
  },
  {
    q: 'How much can I earn?',
    a: 'Earnings scale with watch time. Most videos pay 5–200 points, and every 500 points can be swapped for CELO. Regular viewers earn meaningful amounts — see our redemption table above for the latest rates.',
  },
  {
    q: 'Is KYC required?',
    a: 'No KYC. Samelo is designed for frictionless access — no ID verification, no paperwork. Just watch and earn.',
  },
  {
    q: 'How does the swap to CELO work?',
    a: 'Enter your points amount (min 500 pts), sign a single on-chain transaction, and CELO lands directly in your MiniPay wallet. No gas tricks, no complex math.',
  },
  {
    q: 'Which countries are supported?',
    a: 'Samelo works wherever Opera MiniPay is available — across Africa, Asia, and Latin America. We are built for low-bandwidth networks and affordable data plans.',
  },
  {
    q: 'How do I know it is not a scam?',
    a: 'All payouts are verifiable on the Celo blockchain. Our smart contracts are open-source and auditable. Anyone can inspect the code and verify the flow of funds.',
  },
]

function FAQItem({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: (typeof FAQS)[number]
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="overflow-hidden rounded-xl border transition-all duration-300"
      style={{
        borderColor: isOpen
          ? 'rgba(200,241,53,0.3)'
          : 'rgba(200,241,53,0.1)',
        background: isOpen
          ? 'rgba(200,241,53,0.04)'
          : 'rgba(200,241,53,0.015)',
      }}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-primary">{faq.q}</span>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.06)] text-accent">
          {isOpen ? <Minus size={12} /> : <Plus size={12} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm leading-relaxed text-muted">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      id="faq"
      className="relative overflow-hidden border-b border-[rgba(200,241,53,0.08)] px-5 py-20"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 50% 0%, rgba(200,241,53,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p
            className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent"
            style={{ textShadow: '0 0 12px rgba(200,241,53,0.4)' }}
          >
            Mission briefing
          </p>
          <h2 className="mt-3 font-display text-2xl font-black tracking-tight text-primary sm:text-3xl">
            Frequently asked questions
          </h2>
        </motion.div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={faq.q}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
