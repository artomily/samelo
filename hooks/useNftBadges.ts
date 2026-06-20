import { useQuery } from '@tanstack/react-query'
import type { NftBadgeDefinition, NftBadgeMint } from '@/lib/types/nft-badge'

interface BadgesResponse {
  definitions: NftBadgeDefinition[]
  mints: NftBadgeMint[]
}

export function useNftBadges(wallet: string | undefined) {
  return useQuery<BadgesResponse>({
    queryKey: ['nft-badges', wallet],
    queryFn: async () => {
      const res = await fetch('/api/badges', {
        headers: wallet ? { 'x-wallet-address': wallet } : {},
      })
      if (!res.ok) throw new Error('Failed to load badges')
      return res.json()
    },
    staleTime: 120_000,
  })
}
