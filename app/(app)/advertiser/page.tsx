'use client'

import { useAccount } from 'wagmi'
import { useState } from 'react'
import { CampaignList } from '@/components/advertiser/CampaignList'
import { CampaignForm } from '@/components/advertiser/CampaignForm'

export default function AdvertiserPage() {
  const { address } = useAccount()
  const [showForm, setShowForm] = useState(false)

  if (!address) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-white/50">Connect wallet to access advertiser portal</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Advertiser Portal</h1>
          <p className="text-white/50 mt-1">Manage your campaigns and track performance</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="px-4 py-2 bg-[#c8f135] text-black font-semibold rounded-lg hover:bg-[#d9ff4d] transition-colors text-sm"
        >
          {showForm ? 'Cancel' : '+ New Campaign'}
        </button>
      </div>
      {showForm && <CampaignForm wallet={address} onCreated={() => setShowForm(false)} />}
      <CampaignList wallet={address} />
    </div>
  )
}
