import { useQuery } from '@tanstack/react-query'
import type { PriceSnapshot } from '@/lib/types/price-feed'
import { TRACKED_SYMBOLS } from '@/lib/types/price-feed'

export function usePrices(symbols: string[] = [...TRACKED_SYMBOLS]) {
  return useQuery<{ prices: Record<string, PriceSnapshot> }>({
    queryKey: ['prices', symbols.join(',')],
    queryFn: async () => {
      const res = await fetch(`/api/prices?symbols=${symbols.join(',')}`)
      if (!res.ok) throw new Error('Failed to load prices')
      return res.json()
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}

export function useCeloPrice() {
  const { data, ...rest } = usePrices(['CELO'])
  return { price: data?.prices?.CELO ?? null, ...rest }
}
