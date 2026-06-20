'use client'

import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { truncateAddress } from '@/lib/address'
import { celoscanTx } from '@/lib/celoscan'

export function AdminSwapLog() {
  const { address } = useAccount()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-swaps', address],
    queryFn: async () => {
      const res = await fetch('/api/admin/swaps', { headers: { 'x-wallet-address': address! } })
      return res.json()
    },
    enabled: !!address,
    refetchInterval: 30_000,
  })

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-white/70">Recent Swaps</h3>
      {isLoading && <p className="text-white/40 text-sm">Loading…</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-white/40 border-b border-white/10">
              <th className="text-left py-2 pr-4">Wallet</th>
              <th className="text-right py-2 pr-4">Points</th>
              <th className="text-right py-2 pr-4">MELO</th>
              <th className="text-right py-2">Tx</th>
            </tr>
          </thead>
          <tbody>
            {(data?.swaps ?? []).map((s: { id: string; wallet_address: string; points_burned: number; melo_received: string; tx_hash: string | null }) => (
              <tr key={s.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-1.5 pr-4 font-mono text-white/60">{truncateAddress(s.wallet_address)}</td>
                <td className="py-1.5 pr-4 text-right text-white/70">{s.points_burned.toLocaleString()}</td>
                <td className="py-1.5 pr-4 text-right text-[#c8f135] font-mono">{parseFloat(s.melo_received).toFixed(3)}</td>
                <td className="py-1.5 text-right">
                  {s.tx_hash
                    ? <a href={celoscanTx(s.tx_hash)} target="_blank" rel="noopener noreferrer" className="text-[#35d07f] hover:underline">↗</a>
                    : <span className="text-white/20">—</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
