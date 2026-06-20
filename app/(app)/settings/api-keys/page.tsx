'use client'

import { useAccount } from 'wagmi'
import { ApiKeyList } from '@/components/settings/ApiKeyList'

export default function ApiKeysPage() {
  const { address } = useAccount()

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Orbitron, sans-serif' }}>API Keys</h1>
        <p className="text-sm text-white/50 mt-1">Manage programmatic access to your Samelo account.</p>
      </header>

      {!address ? (
        <p className="text-sm text-white/40">Connect your wallet to manage API keys.</p>
      ) : (
        <ApiKeyList wallet={address} />
      )}
    </main>
  )
}
