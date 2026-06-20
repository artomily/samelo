import { useQuery } from '@tanstack/react-query'
import type { OnchainEvent } from '@/lib/types/onchain-event'

interface EventsResponse {
  events: OnchainEvent[]
}

export function useWalletEvents(
  wallet: string | undefined,
  eventName?: string
) {
  const params = new URLSearchParams()
  if (eventName) params.set('event', eventName)

  return useQuery<EventsResponse>({
    queryKey: ['onchain-events', wallet, eventName],
    queryFn: async () => {
      const res = await fetch(`/api/events/wallet?${params}`, {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load events')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 30_000,
  })
}
