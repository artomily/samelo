export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed'

export interface Advertiser {
  id: string
  wallet: string
  companyName: string
  contactEmail: string | null
  isVerified: boolean
  createdAt: string
}

export interface AdCampaign {
  id: string
  advertiserId: string
  name: string
  budgetCents: number
  spentCents: number
  cpmCents: number
  status: CampaignStatus
  startDate: string | null
  endDate: string | null
  targetCategory: string | null
  createdAt: string
}

export interface AdCampaignWithStats extends AdCampaign {
  impressions: number
  remainingBudgetCents: number
  fillRate: number
}

export interface AdImpression {
  id: string
  campaignId: string
  viewerWallet: string | null
  videoId: string
  costCents: number
  createdAt: string
}

export const CAMPAIGN_STATUS_COLORS: Record<CampaignStatus, string> = {
  draft: '#6b7280',
  active: '#c8f135',
  paused: '#fbcc5c',
  completed: '#6b7280',
}
