'use client'

import { useCampaigns, useUpdateCampaign } from '@/hooks/useCampaigns'
import { CampaignCard } from './CampaignCard'

interface Props {
  wallet: string
}

export function CampaignList({ wallet }: Props) {
  const { data, isLoading } = useCampaigns(wallet)
  const update = useUpdateCampaign(wallet)

  if (isLoading) {
    return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-36 rounded-xl bg-white/5 animate-pulse" />)}</div>
  }

  const campaigns = data?.campaigns ?? []

  if (campaigns.length === 0) {
    return <p className="text-white/40 text-center py-12">No campaigns yet — create one to start</p>
  }

  return (
    <div className="space-y-3">
      {campaigns.map(c => (
        <CampaignCard
          key={c.id}
          campaign={c}
          onPause={() => update.mutate({ id: c.id, status: 'paused' } as any)}
          onActivate={() => update.mutate({ id: c.id, status: 'active' } as any)}
        />
      ))}
    </div>
  )
}
