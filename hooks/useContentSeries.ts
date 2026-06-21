import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ContentSeries, SeriesWithEpisodes } from '@/lib/types/content-series'

export function usePublicSeries() {
  return useQuery({
    queryKey: ['series', 'public'],
    queryFn: async () => {
      const res = await fetch('/api/series')
      if (!res.ok) throw new Error('Failed to fetch series')
      return res.json() as Promise<{ series: ContentSeries[] }>
    },
  })
}

export function useMySeries(wallet?: string) {
  return useQuery({
    queryKey: ['series', 'mine', wallet],
    queryFn: async () => {
      const res = await fetch('/api/series?mine=1', {
        headers: { 'x-wallet-address': wallet! },
      })
      if (!res.ok) throw new Error('Failed to fetch series')
      return res.json() as Promise<{ series: ContentSeries[] }>
    },
    enabled: !!wallet,
  })
}

export function useSeriesDetail(id: string) {
  return useQuery({
    queryKey: ['series', id],
    queryFn: async () => {
      const res = await fetch(`/api/series/${id}`)
      if (!res.ok) throw new Error('Failed to fetch series')
      return res.json() as Promise<{ series: SeriesWithEpisodes }>
    },
    enabled: !!id,
  })
}

export function useCreateSeries(wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: { title: string; description?: string; is_public?: boolean }) => {
      const res = await fetch('/api/series', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to create series')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['series', 'mine', wallet] }),
  })
}
