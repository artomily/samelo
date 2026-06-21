import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { NotificationCenterItem } from '@/lib/types/notifications'

export function useNotificationCenter(wallet?: string) {
  return useQuery({
    queryKey: ['notification-center', wallet],
    queryFn: async () => {
      const res = await fetch('/api/notification-center', {
        headers: { 'x-wallet-address': wallet! },
      })
      if (!res.ok) throw new Error('Failed to fetch notifications')
      return res.json() as Promise<{ notifications: NotificationCenterItem[] }>
    },
    enabled: !!wallet,
    refetchInterval: 30_000,
  })
}

export function useNotificationUnreadCount(wallet?: string) {
  return useQuery({
    queryKey: ['notification-center-count', wallet],
    queryFn: async () => {
      const res = await fetch('/api/notification-center?count=1', {
        headers: { 'x-wallet-address': wallet! },
      })
      if (!res.ok) throw new Error('Failed to fetch count')
      return res.json() as Promise<{ unread: number }>
    },
    enabled: !!wallet,
    refetchInterval: 15_000,
  })
}

export function useMarkNotificationRead(wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/notification-center/${id}`, {
        method: 'PATCH',
        headers: { 'x-wallet-address': wallet },
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-center', wallet] })
      qc.invalidateQueries({ queryKey: ['notification-center-count', wallet] })
    },
  })
}

export function useMarkAllRead(wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await fetch('/api/notification-center', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify({ action: 'mark_all_read' }),
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notification-center', wallet] })
      qc.invalidateQueries({ queryKey: ['notification-center-count', wallet] })
    },
  })
}
