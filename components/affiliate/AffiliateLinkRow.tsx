'use client'

import { conversionRate, buildAffiliateUrl } from '@/lib/types/affiliate'
import type { AffiliateLink } from '@/lib/types/affiliate'

interface Props {
  link: AffiliateLink
}

export function AffiliateLinkRow({ link }: Props) {
  const url = buildAffiliateUrl(link.slug)
  const rate = conversionRate(link)

  const copyLink = () => navigator.clipboard.writeText(url)

  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-[#c8f135]">/go/{link.slug}</span>
        <button
          onClick={copyLink}
          className="text-[10px] text-[#555] hover:text-white border border-[#222] rounded px-2 py-0.5 transition-colors"
        >
          Copy
        </button>
      </div>
      <div className="flex gap-4 text-xs text-[#666]">
        <span><strong className="text-white">{link.click_count}</strong> clicks</span>
        <span><strong className="text-white">{link.conversion_count}</strong> converts</span>
        <span><strong className="text-white">{rate}%</strong> CVR</span>
        <span><strong className="text-[#c8f135]">{link.total_commission_melo}</strong> MELO earned</span>
      </div>
    </div>
  )
}
