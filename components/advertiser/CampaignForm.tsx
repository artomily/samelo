'use client'

import { useState } from 'react'
import { useCreateCampaign } from '@/hooks/useCampaigns'
import { VIDEO_CATEGORIES } from '@/lib/types/video'

interface Props {
  wallet: string
  onCreated?: () => void
}

export function CampaignForm({ wallet, onCreated }: Props) {
  const create = useCreateCampaign(wallet)
  const [name, setName] = useState('')
  const [budget, setBudget] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await create.mutateAsync({
      name,
      budgetCents: Math.round(parseFloat(budget) * 100),
      targetCategory: category || null,
    } as any)
    setName('')
    setBudget('')
    setCategory('')
    onCreated?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white/60 text-sm mb-1">Campaign Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Q1 DeFi Awareness"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-[#c8f135]/50"
          required
        />
      </div>
      <div>
        <label className="block text-white/60 text-sm mb-1">Budget (USD)</label>
        <input
          type="number"
          step="0.01"
          min="1"
          value={budget}
          onChange={e => setBudget(e.target.value)}
          placeholder="500.00"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-[#c8f135]/50"
          required
        />
      </div>
      <div>
        <label className="block text-white/60 text-sm mb-1">Target Category (optional)</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c8f135]/50"
        >
          <option value="">All categories</option>
          {VIDEO_CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={create.isPending}
        className="w-full py-2.5 bg-[#c8f135] text-black font-bold rounded-lg hover:bg-[#d9ff4d] disabled:opacity-50 transition-colors"
      >
        {create.isPending ? 'Creating…' : 'Create Campaign'}
      </button>
    </form>
  )
}
