'use client'

import type { AppNotification } from '@/lib/types/notification'
import { NOTIFICATION_ICONS } from '@/lib/types/notification'
import { timeAgo } from '@/lib/time-ago'

interface NotificationItemProps {
  notification: AppNotification
  onRead: (id: string) => void
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const icon = NOTIFICATION_ICONS[notification.type]
  return (
    <div
      onClick={() => !notification.read && onRead(notification.id)}
      className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all ${
        notification.read ? 'opacity-50' : 'bg-white/5 hover:bg-white/8'
      }`}
    >
      <div className="text-xl flex-shrink-0 w-8 h-8 flex items-center justify-center">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-white leading-snug">{notification.title}</p>
          {!notification.read && (
            <div className="w-2 h-2 rounded-full bg-[#c8f135] flex-shrink-0 mt-1" />
          )}
        </div>
        <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{notification.message}</p>
        <p className="text-[10px] text-white/30 mt-1">{timeAgo(notification.createdAt)}</p>
      </div>
    </div>
  )
}
