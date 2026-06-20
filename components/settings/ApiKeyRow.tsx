'use client'

import { useState } from 'react'
import { maskApiKey, isActive } from '@/lib/types/api-key'
import type { ApiKey } from '@/lib/types/api-key'
import { useRevokeApiKey } from '@/hooks/useApiKeys'

interface Props {
  apiKey: ApiKey
  wallet: string
}

export function ApiKeyRow({ apiKey, wallet }: Props) {
  const active = isActive(apiKey)
  const { mutate: revoke, isPending } = useRevokeApiKey(wallet)
  const [confirming, setConfirming] = useState(false)

  function handleRevoke() {
    if (!confirming) { setConfirming(true); return }
    revoke(apiKey.id)
    setConfirming(false)
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5">
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-sm font-medium truncate">{apiKey.name}</p>
        <p className="text-xs font-mono text-white/40">{maskApiKey(apiKey.key_prefix + '•'.repeat(16))}</p>
        {apiKey.last_used_at && (
          <p className="text-xs text-white/30">
            Last used {new Date(apiKey.last_used_at).toLocaleDateString()}
          </p>
        )}
      </div>
      <span className={['text-xs px-2 py-0.5 rounded-full', active ? 'bg-[#c8f135]/20 text-[#c8f135]' : 'bg-white/10 text-white/40'].join(' ')}>
        {active ? 'Active' : 'Revoked'}
      </span>
      {active && (
        <button
          onClick={handleRevoke}
          disabled={isPending}
          className="text-xs px-3 py-1.5 rounded border transition-colors disabled:opacity-40"
          style={confirming ? { borderColor: '#ef4444', color: '#ef4444' } : { borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)' }}
        >
          {confirming ? 'Confirm revoke' : 'Revoke'}
        </button>
      )}
    </div>
  )
}
