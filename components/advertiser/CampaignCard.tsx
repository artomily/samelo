'use client'

import type { AdCampaign } from '@/lib/types/advertiser'
import { CAMPAIGN_STATUS_COLORS } from '@/lib/types/advertiser'

interface Props {
  campaign: AdCampaign
  onPause?: () => void
  onActivate?: () => void
}

export function CampaignCard({ campaign, onPause, onActivate }: Props) {
  const fillPct = campaign.budgetCents > 0
    ? Math.round((campaign.spentCents / campaign.budgetCents) * 100)
    : 0

  const statusColor = CAMPAIGN_STATUS_COLORS[campaign.status]

  return (
    <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{campaign.name}</h3>
          {campaign.targetCategory && (
            <p className="text-white/40 text-xs mt-0.5">{campaign.targetCategory}</p>
          )}
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ color: statusColor, border: `1px solid ${statusColor}40` }}>
          {campaign.status.toUpperCase()}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-white/50 mb-1">
          <span>Budget used</span>
          <span>{fillPct}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#c8f135] rounded-full transition-all" style={{ width: `${fillPct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>${(campaign.spentCents / 100).toFixed(2)} spent</span>
          <span>${(campaign.budgetCents / 100).toFixed(2)} total</span>
        </div>
      </div>

      <div className="flex gap-2">
        {campaign.status === 'active' && onPause && (
          <button onClick={onPause} className="flex-1 py-1.5 rounded-lg border border-white/20 text-white/60 text-sm hover:border-white/40 transition-colors">
            Pause
          </button>
        )}
        {campaign.status === 'paused' && onActivate && (
          <button onClick={onActivate} className="flex-1 py-1.5 rounded-lg bg-[#c8f135] text-black text-sm font-semibold hover:bg-[#d9ff4d] transition-colors">
            Activate
          </button>
        )}
      </div>
    </div>
  )
}
