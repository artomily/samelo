import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AdCampaign } from '@/lib/types/advertiser'

async function fetchCampaigns(wallet: string): Promise<{ campaigns: AdCampaign[] }> {
  const res = await fetch('/api/advertiser/campaigns', {
    headers: { 'x-wallet-address': wallet },
  })
  if (!res.ok) throw new Error('Failed to fetch campaigns')
  return res.json()
}

export function useCampaigns(wallet: string | null) {
  return useQuery({
    queryKey: ['campaigns', wallet],
    queryFn: () => fetchCampaigns(wallet!),
    enabled: !!wallet,
    staleTime: 60_000,
  })
}

export function useCreateCampaign(wallet: string | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<AdCampaign>) => {
      const res = await fetch('/api/advertiser/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': wallet ?? '' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Create campaign failed')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns', wallet] }),
  })
}

export function useUpdateCampaign(wallet: string | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<AdCampaign> & { id: string }) => {
      const res = await fetch(`/api/advertiser/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': wallet ?? '' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Update campaign failed')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns', wallet] }),
  })
}
