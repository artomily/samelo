import { useQuery } from '@tanstack/react-query'

interface CampaignAnalytics {
  totalImpressions: number
  totalSpent: number
  remainingBudget: number
  fillRate: number
  avgCpm: number
}

async function fetchAnalytics(campaignId: string, wallet: string): Promise<CampaignAnalytics> {
  const res = await fetch(`/api/advertiser/campaigns/${campaignId}/analytics`, {
    headers: { 'x-wallet-address': wallet },
  })
  if (!res.ok) throw new Error('Failed to fetch analytics')
  return res.json()
}

export function useCampaignAnalytics(campaignId: string | null, wallet: string | null) {
  return useQuery({
    queryKey: ['campaign-analytics', campaignId, wallet],
    queryFn: () => fetchAnalytics(campaignId!, wallet!),
    enabled: !!(campaignId && wallet),
    refetchInterval: 60_000,
  })
}
