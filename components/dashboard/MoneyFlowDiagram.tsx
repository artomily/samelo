'use client'

import { useTreasuryMetrics } from '@/hooks/useTreasuryMetrics'
import { Skeleton } from '@/components/Skeleton'

interface FlowNodeProps {
  layer: string
  title: string
  subtitle: string
  value: string
  unit: string
  color: string
  borderColor: string
}

function FlowNode({ layer, title, subtitle, value, unit, color, borderColor }: FlowNodeProps) {
  return (
    <div
      className="rounded-2xl border p-4 flex flex-col gap-2 relative overflow-hidden"
      style={{ background: color, borderColor }}
    >
      <div className="flex items-center gap-2">
        <span
          className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ background: borderColor, color: '#030303' }}
        >
          {layer}
        </span>
        <span className="text-xs font-semibold text-white/70">{title}</span>
      </div>
      <p className="text-[11px] text-white/40 leading-relaxed">{subtitle}</p>
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="font-mono text-2xl font-black text-white">{value}</span>
        <span className="text-xs text-white/40">{unit}</span>
      </div>
    </div>
  )
}

function Arrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-1 gap-1">
      <div className="w-px h-6 bg-gradient-to-b from-[rgba(200,241,53,0.4)] to-transparent" />
      <span className="text-[9px] uppercase tracking-widest text-white/20 font-display">{label}</span>
      <svg width="12" height="6" viewBox="0 0 12 6" fill="rgba(200,241,53,0.4)">
        <path d="M6 6L0 0h12z" />
      </svg>
    </div>
  )
}

export function MoneyFlowDiagram() {
  const { data, isLoading } = useTreasuryMetrics()

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className={`rounded-xl ${i % 2 === 1 ? 'h-8' : 'h-24'}`} />
        ))}
      </div>
    )
  }

  if (!data) return null

  const { funnel } = data

  const nodes = [
    {
      layer: 'WEB2',
      title: 'YouTube / Ad Revenue',
      subtitle: 'Advertisers pay CPM for video placement. Revenue received in USD.',
      value: funnel.web2Events.toLocaleString(),
      unit: 'watch events',
      color: 'rgba(255,100,100,0.08)',
      borderColor: 'rgba(255,100,100,0.4)',
    },
    {
      layer: 'OFFCHAIN',
      title: 'Samelo Points Engine',
      subtitle: 'Watch events verified via HMAC token. Points minted off-chain per wallet.',
      value: funnel.pointsIssued.toLocaleString(),
      unit: 'points issued',
      color: 'rgba(251,204,92,0.08)',
      borderColor: 'rgba(251,204,92,0.4)',
    },
    {
      layer: 'BRIDGE',
      title: 'Oracle Signature',
      subtitle: 'ECDSA oracle signs each redemption. Prevents replay attacks across contracts.',
      value: funnel.pointsBurned.toLocaleString(),
      unit: 'points redeemed',
      color: 'rgba(53,208,127,0.08)',
      borderColor: 'rgba(53,208,127,0.4)',
    },
    {
      layer: 'WEB3',
      title: '$MELO Token — Celo Chain',
      subtitle: 'Smart contract mints $MELO to user wallet. Verifiable on Celoscan.',
      value: funnel.meloOnChain,
      unit: '$MELO minted',
      color: 'rgba(200,241,53,0.08)',
      borderColor: 'rgba(200,241,53,0.4)',
    },
  ]

  const arrows = ['HMAC verify', 'oracle sign', 'on-chain mint']

  return (
    <div className="flex flex-col items-stretch max-w-lg mx-auto">
      {nodes.map((node, i) => (
        <div key={node.layer}>
          <FlowNode {...node} />
          {i < nodes.length - 1 && <Arrow label={arrows[i]} />}
        </div>
      ))}

      {/* Celoscan link */}
      <div className="mt-4 text-center">
        <a
          href="https://celoscan.io"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[11px] text-accent/60 hover:text-accent transition-colors"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#c8f135] animate-pulse" />
          Verify on Celoscan →
        </a>
      </div>
    </div>
  )
}
