'use client'

import { useNotificationCenter, useMarkNotificationRead, useMarkAllRead } from '@/hooks/useNotificationCenter'
import { NOTIFICATION_ICONS, NOTIFICATION_COLORS, unreadCount } from '@/lib/types/notifications'

interface Props {
  wallet: string
}

export function NotificationCenterPanel({ wallet }: Props) {
  const { data, isLoading } = useNotificationCenter(wallet)
  const markRead = useMarkNotificationRead(wallet)
  const markAll = useMarkAllRead(wallet)

  const notifications = data?.notifications ?? []
  const count = unreadCount(notifications)

  if (isLoading) {
    return <div className="p-4 text-sm text-[#666] animate-pulse">Loading…</div>
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#222]">
        <span className="text-sm font-semibold text-white">
          Notifications{count > 0 && <span className="ml-2 text-[#c8f135]">{count}</span>}
        </span>
        {count > 0 && (
          <button
            onClick={() => markAll.mutate()}
            className="text-xs text-[#666] hover:text-[#c8f135] transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-6 text-center text-sm text-[#555]">No notifications yet.</div>
      ) : (
        <div className="flex flex-col divide-y divide-[#1a1a1a]">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => !n.is_read && markRead.mutate(n.id)}
              className={`flex items-start gap-3 px-4 py-3 text-left hover:bg-[#0d0d0d] transition-colors ${n.is_read ? 'opacity-50' : ''}`}
            >
              <span
                className="text-lg shrink-0 mt-0.5"
                style={{ color: NOTIFICATION_COLORS[n.type] }}
              >
                {NOTIFICATION_ICONS[n.type]}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-white">{n.title}</span>
                <span className="text-xs text-[#888]">{n.body}</span>
              </div>
              {!n.is_read && (
                <span className="ml-auto mt-1.5 w-2 h-2 rounded-full bg-[#c8f135] shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
