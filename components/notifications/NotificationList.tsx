'use client'
import { useNotifications, useMarkAllRead } from '@/hooks/useNotifications'
import { NotificationItem } from './NotificationItem'
import { Skeleton } from '@/components/ui/Skeleton'

export function NotificationList() {
  const { data, isLoading } = useNotifications()
  const { mutate: markAll, isPending } = useMarkAllRead()

  if (isLoading) {
    return (
      <div className="space-y-2 p-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3 p-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const notifications = data?.notifications ?? []
  const unreadCount = data?.unreadCount ?? 0

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-center px-4">
        <span className="text-4xl mb-3">🔔</span>
        <p className="text-white/40 text-sm">No notifications yet</p>
      </div>
    )
  }

  return (
    <div>
      {unreadCount > 0 && (
        <div className="flex items-center justify-between px-3 pt-2 pb-1">
          <span className="text-xs text-white/40">{unreadCount} unread</span>
          <button
            onClick={() => markAll()}
            disabled={isPending}
            className="text-xs text-[#c8f135] hover:opacity-70 transition-opacity disabled:opacity-40"
          >
            Mark all read
          </button>
        </div>
      )}
      <div className="space-y-0.5 p-2">
        {notifications.map(n => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>
    </div>
  )
}
