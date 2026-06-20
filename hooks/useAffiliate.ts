import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AffiliateCampaign, AffiliateLink } from '@/lib/types/affiliate'

export function useAffiliateCampaigns() {
  return useQuery<{ campaigns: AffiliateCampaign[] }>({
    queryKey: ['affiliate-campaigns'],
    queryFn: async () => {
      const res = await fetch('/api/affiliate')
      if (!res.ok) throw new Error('Failed to load campaigns')
      return res.json()
    },
    staleTime: 300_000,
  })
}

export function useWalletAffiliateLinks(wallet: string | undefined) {
  return useQuery<{ links: AffiliateLink[] }>({
    queryKey: ['affiliate-links', wallet],
    queryFn: async () => {
      const res = await fetch('/api/affiliate?mode=my-links', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load links')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })
}

export function useCreateAffiliateLink(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { campaign_id: string; target_url: string; campaign_name: string }) => {
      const res = await fetch('/api/affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': wallet ?? '' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to create link')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['affiliate-links', wallet] }),
  })
}
