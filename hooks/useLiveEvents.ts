import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { LiveEvent } from '@/lib/types/live-events'

interface EventsResponse {
  events: LiveEvent[]
}

interface EventDetailResponse {
  event: LiveEvent
  rsvp_count: number
}

export function useLiveEvents() {
  return useQuery<EventsResponse>({
    queryKey: ['live-events'],
    queryFn: async () => {
      const res = await fetch('/api/events')
      if (!res.ok) throw new Error('Failed to load events')
      return res.json()
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}

export function useLiveEventDetail(id: string | undefined) {
  return useQuery<EventDetailResponse>({
    queryKey: ['live-event', id],
    queryFn: async () => {
      const res = await fetch(`/api/events/${id}`)
      if (!res.ok) throw new Error('Failed to load event')
      return res.json()
    },
    enabled: !!id,
    staleTime: 15_000,
    refetchInterval: 15_000,
  })
}

export function useRsvpEvent(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (eventId: string) => {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': wallet ?? '' },
        body: JSON.stringify({ action: 'rsvp' }),
      })
      if (!res.ok) throw new Error('Failed to RSVP')
      return res.json()
    },
    onSuccess: (_data, eventId) => {
      qc.invalidateQueries({ queryKey: ['live-event', eventId] })
    },
  })
}
