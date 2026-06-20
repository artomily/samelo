import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { EmbedConfig, EmbedTheme } from '@/lib/types/embed-player'

export function useEmbedConfigs(wallet: string | undefined) {
  return useQuery<{ configs: EmbedConfig[] }>({
    queryKey: ['embed-configs', wallet],
    queryFn: async () => {
      const res = await fetch('/api/embed', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load embed configs')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 60_000,
  })
}

export function useCreateEmbedConfig(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      video_id: string
      name: string
      theme?: EmbedTheme
      show_quiz?: boolean
      show_chapters?: boolean
      embed_domains?: string[]
    }) => {
      const res = await fetch('/api/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': wallet ?? '' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to create embed config')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['embed-configs', wallet] }),
  })
}
