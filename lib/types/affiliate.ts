export interface AffiliateCampaign {
  id: string
  owner_wallet: string
  name: string
  description: string | null
  commission_pct: number
  is_active: boolean
  created_at: string
}

export interface AffiliateLink {
  id: string
  campaign_id: string
  affiliate_wallet: string
  slug: string
  target_url: string
  click_count: number
  conversion_count: number
  total_commission_melo: number
  is_active: boolean
  created_at: string
}

export interface AffiliateClick {
  id: string
  link_id: string
  visitor_wallet: string | null
  ip_hash: string | null
  converted: boolean
  commission_melo: number | null
  created_at: string
}

export function conversionRate(link: AffiliateLink): number {
  if (link.click_count === 0) return 0
  return parseFloat(((link.conversion_count / link.click_count) * 100).toFixed(1))
}

export function buildAffiliateUrl(slug: string, baseUrl = ''): string {
  return `${baseUrl}/go/${slug}`
}

export function generateSlug(affiliateWallet: string, campaignName: string): string {
  const base = campaignName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 12)
  const suffix = affiliateWallet.slice(2, 6).toLowerCase()
  return `${base}-${suffix}`
}
