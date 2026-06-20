'use client'

import { useState } from 'react'
import { useCreateApiKey } from '@/hooks/useApiKeys'
import type { ApiKeyWithSecret } from '@/lib/types/api-key'

interface Props {
  wallet: string
}

export function CreateApiKeyForm({ wallet }: Props) {
  const [name, setName] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [created, setCreated] = useState<ApiKeyWithSecret | null>(null)
  const [copied, setCopied] = useState(false)
  const { mutate, isPending } = useCreateApiKey(wallet)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    mutate({ name: name.trim(), expiresAt: expiresAt || undefined }, {
      onSuccess: (key) => {
        setCreated(key)
        setName('')
        setExpiresAt('')
      },
    })
  }

  async function copyKey() {
    if (!created) return
    await navigator.clipboard.writeText(created.plaintext)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (created) {
    return (
      <div className="rounded-xl border border-[#c8f135]/30 bg-[#c8f135]/5 p-4 space-y-3">
        <p className="text-sm font-semibold" style={{ color: '#c8f135' }}>API key created — save it now</p>
        <p className="font-mono text-xs break-all bg-black/30 p-2 rounded">{created.plaintext}</p>
        <div className="flex gap-2">
          <button
            onClick={copyKey}
            className="text-xs px-3 py-1.5 rounded border border-white/20 hover:border-white/40"
          >
            {copied ? 'Copied!' : 'Copy key'}
          </button>
          <button
            onClick={() => setCreated(null)}
            className="text-xs px-3 py-1.5 rounded"
            style={{ background: '#c8f135', color: '#030303' }}
          >
            Done
          </button>
        </div>
        <p className="text-xs text-white/40">This key will not be shown again.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Key name"
          maxLength={50}
          className="px-3 py-2 rounded bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30"
        />
        <input
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          placeholder="Expires (optional)"
          className="px-3 py-2 rounded bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30"
        />
      </div>
      <button
        type="submit"
        disabled={isPending || !name.trim()}
        className="text-sm px-4 py-2 rounded font-medium transition-opacity disabled:opacity-40"
        style={{ background: '#c8f135', color: '#030303' }}
      >
        {isPending ? 'Creating…' : 'Create API key'}
      </button>
    </form>
  )
}
