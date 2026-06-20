'use client'

import { useNotificationsV2, useMarkAllRead } from '@/hooks/useNotificationsV2'
import { NotificationItemV2 } from './NotificationItemV2'

interface Props {
  wallet: string
}

export function NotificationFeedV2({ wallet }: Props) {
  const { data, isLoading } = useNotificationsV2(wallet)
  const { mutate: markAll, isPending } = useMarkAllRead(wallet)

  if (isLoading) return <p className="text-sm text-white/40 p-4">Loading…</p>
  if (!data?.notifications.length) {
    return <p className="text-sm text-white/40 p-4">No notifications yet.</p>
  }

  return (
    <div className="space-y-3">
      {data.unreadCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50">{data.unreadCount} unread</span>
          <button
            onClick={() => markAll()}
            disabled={isPending}
            className="text-xs text-white/50 hover:text-white/80 disabled:opacity-40 transition-colors"
          >
            Mark all read
          </button>
        </div>
      )}
      <ul className="space-y-2">
        {data.notifications.map((n) => (
          <li key={n.id}>
            <NotificationItemV2 notification={n} wallet={wallet} />
          </li>
        ))}
      </ul>
    </div>
  )
}
