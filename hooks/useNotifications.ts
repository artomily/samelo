'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import type { Notification } from '@/lib/types/notification'
import { SWR_KEYS } from '@/lib/cache/swr-keys'

interface NotificationsResponse {
  notifications: Notification[]
  unreadCount: number
}

export function useNotifications(unreadOnly = false) {
  const { address } = useAccount()

  return useQuery<NotificationsResponse>({
    queryKey: [...SWR_KEYS.notifications(address ?? ''), unreadOnly],
    queryFn: async () => {
      if (!address) return { notifications: [], unreadCount: 0 }
      const params = new URLSearchParams({ wallet: address })
      if (unreadOnly) params.set('unread', 'true')
      const res = await fetch(`/api/notifications?${params}`)
      if (!res.ok) throw new Error('Failed to fetch notifications')
      return res.json()
    },
    enabled: !!address,
    staleTime: 15_000,
    refetchInterval: 30_000,
  })
}

export function useMarkAsRead() {
  const { address } = useAccount()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'x-wallet-address': address ?? '' },
      })
      if (!res.ok) throw new Error('Failed to mark as read')
    },
    onSuccess: () => {
      if (address) qc.invalidateQueries({ queryKey: SWR_KEYS.notifications(address) })
    },
  })
}

export function useMarkAllRead() {
  const { address } = useAccount()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!address) return
      const res = await fetch(`/api/notifications?wallet=${address}`, { method: 'PATCH' })
      if (!res.ok) throw new Error('Failed to mark all as read')
    },
    onSuccess: () => {
      if (address) qc.invalidateQueries({ queryKey: SWR_KEYS.notifications(address) })
    },
  })
}
