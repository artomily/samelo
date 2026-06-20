'use client'

import { CLAIM_SOURCE_LABELS, CLAIM_STATUS_COLORS } from '@/lib/types/reward-claim'
import type { RewardClaimRequest } from '@/lib/types/reward-claim'

interface Props {
  claim: RewardClaimRequest
}

export function ClaimRow({ claim }: Props) {
  const statusColor = CLAIM_STATUS_COLORS[claim.status]

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#111] last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white">{CLAIM_SOURCE_LABELS[claim.source]}</p>
        <p className="text-xs text-[#555] mt-0.5">
          {new Date(claim.requested_at).toLocaleDateString()}
          {claim.admin_note && ` · ${claim.admin_note}`}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-[#c8f135]">{claim.amount_melo} MELO</p>
        <p className="text-xs font-semibold capitalize" style={{ color: statusColor }}>
          {claim.status}
        </p>
      </div>
    </div>
  )
}
