'use client'

import { TOKEN_TYPE_LABELS, formatMinBalance } from '@/lib/types/token-gate'
import type { TokenGate } from '@/lib/types/token-gate'

interface Props {
  gate: TokenGate
  passed?: boolean
}

export function TokenGateCard({ gate, passed }: Props) {
  return (
    <div className={[
      'rounded-xl border p-4 space-y-2',
      passed === true
        ? 'border-[#c8f135]/30 bg-[#c8f135]/5'
        : passed === false
        ? 'border-red-500/30 bg-red-500/5'
        : 'border-white/10 bg-white/5',
    ].join(' ')}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">{gate.name}</p>
        {passed !== undefined && (
          <span className={['text-xs px-2 py-0.5 rounded-full font-medium', passed ? 'bg-[#c8f135]/20 text-[#c8f135]' : 'bg-red-500/20 text-red-400'].join(' ')}>
            {passed ? 'Unlocked' : 'Locked'}
          </span>
        )}
      </div>
      {gate.description && <p className="text-xs text-white/50">{gate.description}</p>}
      <div className="text-xs text-white/40 space-y-0.5">
        <p>Type: {TOKEN_TYPE_LABELS[gate.token_type]}</p>
        <p>{formatMinBalance(gate)}</p>
        <p className="font-mono truncate">{gate.token_address}</p>
      </div>
    </div>
  )
}
