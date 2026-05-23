'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CosmicBackground } from '@/app/components/ui/CosmicBackground'

const STATS = [
  { value: '$0.05', label: 'Per video' },
  { value: '24h', label: 'Instant payout' },
  { value: 'MELOUSD', label: 'Stablecoin' },
  { value: '0', label: 'Friction' },
]

// Orbit ring data
const RINGS = [
  { size: 340, duration: 18, delay: 0, thickness: 1, opacity: 0.18 },
  { size: 460, duration: 28, delay: 2, thickness: 1, opacity: 0.10 },
  { size: 580, duration: 40, delay: 4, thickness: 1, opacity: 0.06 },
]

// Floating reward particles
const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: `${10 + (i * 11) % 80}%`,
  delay: i * 0.7,
  duration: 3 + (i % 3),
  label: ['+0.05', '+0.12', '+0.08', '+0.22', '+0.07', '+0.15', '+0.09', '+0.18'][i],
}))

export function HeroSection() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-28 text-center">
      {/* Cosmic background */}
      <CosmicBackground />

      {/* Top glow origin */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(200,241,53,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Floating orbit rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {RINGS.map((ring, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-accent animate-orbit-slow"
            style={{
              width: ring.size,
              height: ring.size,
              borderColor: `rgba(200,241,53,${ring.opacity})`,
              borderWidth: ring.thickness,
              animationDuration: `${ring.duration}s`,
              animationDelay: `${ring.delay}s`,
              animationDirection: i % 2 === 1 ? 'reverse' : 'normal',
            }}
          />
        ))}
      </div>

      {/* Floating reward particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="pointer-events-none absolute bottom-32 font-display text-[10px] font-bold text-accent"
          style={{
            left: p.x,
            textShadow: '0 0 12px rgba(200,241,53,0.8)',
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          {p.label} MELOUSD
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(200,241,53,0.3)] bg-[rgba(200,241,53,0.08)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent shadow-[0_0_6px_rgba(200,241,53,0.8)]" />
          Live on Celo · MiniPay Native
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display max-w-[18ch] text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-[60px]"
          style={{ textShadow: '0 0 40px rgba(200,241,53,0.15)' }}
        >
          Watch Videos.{' '}
          <span className="text-gradient">Earn Points.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-[38ch] text-sm leading-relaxed text-muted sm:text-base"
        >
          Watch short videos and earn points — pay out to CELO on your MiniPay wallet. No tricks, no waiting.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          <Link
            href="/watch"
            className="btn-neon inline-flex items-center justify-center px-8 py-3.5 text-[13px]"
          >
            Start Watching
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-full border border-[rgba(200,241,53,0.2)] bg-[rgba(200,241,53,0.04)] px-8 py-3.5 text-[13px] font-medium text-muted transition-all hover:border-[rgba(200,241,53,0.4)] hover:text-accent"
          >
            How it works
          </a>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-10 mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-[rgba(200,241,53,0.1)] pt-8"
      >
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-[22px] font-black text-accent" style={{ textShadow: '0 0 16px rgba(200,241,53,0.4)' }}>{s.value}</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-widest text-muted">{s.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  )
}

