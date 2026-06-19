'use client'

import Link from 'next/link'
import { FunnelMetrics } from '@/components/dashboard/FunnelMetrics'
import { MoneyFlowDiagram } from '@/components/dashboard/MoneyFlowDiagram'
import { FlowChart } from '@/components/dashboard/FlowChart'
import { LiveSwapFeed } from '@/components/dashboard/LiveSwapFeed'
import { BurnRateGauge } from '@/components/dashboard/BurnRateGauge'

export default function OnChainDashboardPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#030303]">
      <header
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgba(200,241,53,0.10)] px-4 py-3 sm:px-7"
        style={{ background: 'rgba(3,3,3,0.92)', backdropFilter: 'blur(16px)' }}
      >
        <div>
          <p
            className="font-display text-[13px] font-black uppercase tracking-[0.15em] text-[#c8f135]"
            style={{ textShadow: '0 0 10px rgba(200,241,53,0.2)' }}
          >
            On-Chain Dashboard
          </p>
          <p className="mt-0.5 text-[11px] text-white/40">
            Web2 → Web3 money flow · Live
          </p>
        </div>
        <Link
          href="/home"
          className="rounded-full border border-[rgba(200,241,53,0.3)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#c8f135] hover:bg-[rgba(200,241,53,0.06)] transition-colors"
        >
          Back
        </Link>
      </header>

      <div className="px-4 py-5 pb-24 sm:px-7 space-y-6 max-w-4xl mx-auto w-full">
        {/* Explainer */}
        <div className="rounded-xl border border-[rgba(200,241,53,0.12)] bg-[rgba(200,241,53,0.04)] px-4 py-3">
          <p className="text-[11px] text-white/60 leading-relaxed">
            <span className="text-[#c8f135] font-semibold">How money moves:</span> Advertisers pay CPM fees in USD →
            Samelo distributes points to viewers per watch event →
            Oracle signs redemption requests →
            Users burn points on-chain to mint $MELO tokens on Celo.
            Every step is traceable.
          </p>
        </div>

        {/* Top metrics */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-white/40">Protocol Metrics</h2>
          <FunnelMetrics />
        </section>

        {/* Flow diagram + burn gauge side by side */}
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-white/40">Money Flow Path</h2>
            <MoneyFlowDiagram />
          </section>
          <section className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-white/40">Redemption Health</h2>
            <BurnRateGauge />
          </section>
        </div>

        {/* Time series chart */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-white/40">Daily Activity</h2>
          <FlowChart />
        </section>

        {/* Live swap feed */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-white/40">Live Swaps</h2>
          <LiveSwapFeed />
        </section>

        {/* Celoscan CTA */}
        <div className="text-center pt-2 pb-4">
          <a
            href="https://celoscan.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-white/30 hover:text-[#c8f135] transition-colors"
          >
            All transactions are publicly verifiable on Celoscan ↗
          </a>
        </div>
      </div>
    </div>
  )
}
