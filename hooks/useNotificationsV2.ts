import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { NotificationV2 } from '@/lib/types/notification-v2'

interface NotificationsResponse {
  notifications: NotificationV2[]
  unreadCount: number
}

export function useNotificationsV2(wallet: string | undefined) {
  return useQuery<NotificationsResponse>({
    queryKey: ['notifications-v2', wallet],
    queryFn: async () => {
      const res = await fetch('/api/notifications/v2', {
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to load notifications')
      return res.json()
    },
    enabled: !!wallet,
    staleTime: 30_000,
  })
}

export function useMarkAllRead(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      const res = await fetch('/api/notifications/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet ?? '',
        },
        body: JSON.stringify({ action: 'mark_all_read' }),
      })
      if (!res.ok) throw new Error('Failed to mark all read')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications-v2', wallet] }),
  })
}

export function useMarkRead(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(`/api/notifications/v2/${id}`, {
        method: 'POST',
        headers: { 'x-wallet-address': wallet ?? '' },
      })
      if (!res.ok) throw new Error('Failed to mark read')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications-v2', wallet] }),
  })
}
