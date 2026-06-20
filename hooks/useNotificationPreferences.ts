'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import type { NotificationPreferences } from '@/lib/types/notification'

export function useNotificationPreferences() {
  const { address } = useAccount()

  return useQuery<NotificationPreferences>({
    queryKey: ['notification-preferences', address],
    queryFn: async () => {
      const res = await fetch('/api/notifications/preferences', {
        headers: { 'x-wallet-address': address ?? '' },
      })
      if (!res.ok) throw new Error('Failed to fetch preferences')
      return res.json()
    },
    enabled: !!address,
    staleTime: 60_000,
  })
}

export function useUpdateNotificationPreferences() {
  const { address } = useAccount()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (prefs: Partial<Omit<NotificationPreferences, 'wallet' | 'updated_at'>>) => {
      const res = await fetch('/api/notifications/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': address ?? '',
        },
        body: JSON.stringify(prefs),
      })
      if (!res.ok) throw new Error('Failed to update preferences')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-preferences', address] })
    },
  })
}
