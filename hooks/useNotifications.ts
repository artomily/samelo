import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import type { AppNotification } from '@/lib/types/notification'

async function fetchNotifications(wallet: string): Promise<{ notifications: AppNotification[] }> {
  const res = await fetch(`/api/notifications?wallet=${wallet}`)
  if (!res.ok) throw new Error('Failed to fetch notifications')
  return res.json()
}

export function useNotifications() {
  const { address } = useAccount()
  return useQuery({
    queryKey: ['notifications', address],
    queryFn: () => fetchNotifications(address!),
    enabled: !!address,
    refetchInterval: 30_000,
  })
}

export function useUnreadCount() {
  const { data } = useNotifications()
  return (data?.notifications ?? []).filter(n => !n.read).length
}

export function useMarkNotificationsRead() {
  const { address } = useAccount()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (notificationId?: string) =>
      fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: address, notificationId }),
      }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications', address] }),
  })
}
