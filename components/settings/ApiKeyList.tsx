'use client'

import { useApiKeys } from '@/hooks/useApiKeys'
import { ApiKeyRow } from './ApiKeyRow'
import { CreateApiKeyForm } from './CreateApiKeyForm'

interface Props {
  wallet: string
}

export function ApiKeyList({ wallet }: Props) {
  const { data, isLoading, isError } = useApiKeys(wallet)

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">New key</h2>
        <CreateApiKeyForm wallet={wallet} />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Your keys</h2>
        {isLoading && (
          <p className="text-sm text-white/40">Loading…</p>
        )}
        {isError && (
          <p className="text-sm text-red-400">Failed to load API keys.</p>
        )}
        {data?.keys && data.keys.length === 0 && (
          <p className="text-sm text-white/40">No API keys yet.</p>
        )}
        {data?.keys && data.keys.length > 0 && (
          <ul className="space-y-2">
            {data.keys.map((key) => (
              <li key={key.id}>
                <ApiKeyRow apiKey={key} wallet={wallet} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
