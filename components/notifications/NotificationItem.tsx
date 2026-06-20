'use client'
import { NOTIFICATION_ICONS } from '@/lib/types/notification'
import type { Notification } from '@/lib/types/notification'
import { formatRelative } from '@/lib/utils/date'
import { useMarkAsRead } from '@/hooks/useNotifications'

interface NotificationItemProps {
  notification: Notification
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { mutate: markRead } = useMarkAsRead()
  const isUnread = !notification.read_at

  return (
    <div
      className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isUnread ? 'bg-white/5 hover:bg-white/8' : 'hover:bg-white/3'
      }`}
      onClick={() => isUnread && markRead(notification.id)}
    >
      <span className="text-xl flex-shrink-0 mt-0.5">
        {NOTIFICATION_ICONS[notification.type]}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-medium ${isUnread ? 'text-white' : 'text-white/60'}`}>
            {notification.title}
          </p>
          {isUnread && (
            <span className="w-2 h-2 rounded-full bg-[#c8f135] flex-shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-white/40 mt-0.5">{notification.body}</p>
        <p className="text-xs text-white/25 mt-1">
          {formatRelative(new Date(notification.created_at))}
        </p>
      </div>
    </div>
  )
}
