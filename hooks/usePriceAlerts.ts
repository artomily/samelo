import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { PriceAlert } from '@/lib/types/price-alerts'

export function usePriceAlerts(wallet?: string) {
  return useQuery({
    queryKey: ['price-alerts', wallet],
    queryFn: async () => {
      const res = await fetch('/api/price-alerts', {
        headers: { 'x-wallet-address': wallet! },
      })
      if (!res.ok) throw new Error('Failed to fetch alerts')
      return res.json() as Promise<{ alerts: PriceAlert[] }>
    },
    enabled: !!wallet,
  })
}

export function useCreatePriceAlert(wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: { token_symbol?: string; condition: 'above' | 'below'; target_price: number }) => {
      const res = await fetch('/api/price-alerts', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to create alert')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['price-alerts', wallet] }),
  })
}

export function useDeactivateAlert(wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (alertId: string) => {
      await fetch('/api/price-alerts', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify({ action: 'deactivate', alert_id: alertId }),
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['price-alerts', wallet] }),
  })
}
