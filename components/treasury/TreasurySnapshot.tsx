'use client'

import { netFlow } from '@/lib/types/dao-treasury'
import type { TreasurySnapshot } from '@/lib/types/dao-treasury'

interface Props {
  snapshot: TreasurySnapshot
}

export function TreasurySnapshotCard({ snapshot }: Props) {
  const net = netFlow(snapshot)

  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-5 space-y-4">
      <h3 className="text-xs text-[#555] uppercase tracking-widest">Treasury · {snapshot.snapshot_date}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-bold text-[#c8f135] font-[Orbitron]">{snapshot.balance_melo.toFixed(2)}</p>
          <p className="text-xs text-[#555] mt-0.5">MELO Balance</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white font-[Orbitron]">{snapshot.balance_cusd.toFixed(2)}</p>
          <p className="text-xs text-[#555] mt-0.5">cUSD Balance</p>
        </div>
      </div>
      <div className="flex gap-6 text-xs pt-2 border-t border-[#1a1a1a]">
        <div>
          <p className="text-[#c8f135]">↑ {snapshot.total_inflow_melo.toFixed(2)} MELO</p>
          <p className="text-[#555]">Total Inflow</p>
        </div>
        <div>
          <p className="text-red-400">↓ {snapshot.total_outflow_melo.toFixed(2)} MELO</p>
          <p className="text-[#555]">Total Outflow</p>
        </div>
        <div>
          <p className={net >= 0 ? 'text-[#c8f135]' : 'text-red-400'}>
            {net >= 0 ? '+' : ''}{net.toFixed(2)} MELO
          </p>
          <p className="text-[#555]">Net Flow</p>
        </div>
      </div>
    </div>
  )
}
