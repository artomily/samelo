import { WalletConnector } from '@/components/celo/WalletConnector'
import { TokenBalance, BalanceRow } from '@/components/celo/TokenBalance'
import { OnChainPoints } from '@/components/celo/OnChainPoints'
import { NetworkBadge } from '@/components/celo/NetworkBadge'

export default function WalletPage() {
  return (
    <main className="min-h-screen bg-[#030303] text-white px-4 py-8 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl text-[#c8f135]">Wallet</h1>
        <NetworkBadge />
      </div>

      <section className="mb-6">
        <WalletConnector />
      </section>

      <section className="bg-white/5 rounded-xl p-4 mb-4">
        <h2 className="text-sm text-white/40 uppercase tracking-wide mb-3">Balances</h2>
        <BalanceRow />
      </section>

      <section className="bg-white/5 rounded-xl p-4">
        <h2 className="text-sm text-white/40 uppercase tracking-wide mb-3">On-Chain Activity</h2>
        <OnChainPoints />
      </section>
    </main>
  )
}
