'use client'

import { NOTIFICATION_ICONS_V2, isUnread } from '@/lib/types/notification-v2'
import type { NotificationV2 } from '@/lib/types/notification-v2'
import { useMarkRead } from '@/hooks/useNotificationsV2'

interface Props {
  notification: NotificationV2
  wallet: string
}

export function NotificationItemV2({ notification: n, wallet }: Props) {
  const { mutate: markRead } = useMarkRead(wallet)
  const unread = isUnread(n)
  const icon = NOTIFICATION_ICONS_V2[n.type]

  function handleClick() {
    if (unread) markRead(n.id)
  }

  return (
    <button
      onClick={handleClick}
      className={[
        'w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl transition-colors',
        unread ? 'bg-white/8 border border-white/10' : 'bg-white/3 border border-white/5',
      ].join(' ')}
    >
      <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight">{n.title}</p>
        <p className="text-xs text-white/50 mt-0.5 leading-snug">{n.body}</p>
        <p className="text-xs text-white/30 mt-1">
          {new Date(n.created_at).toLocaleDateString()}
        </p>
      </div>
      {unread && (
        <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#c8f135' }} />
      )}
    </button>
  )
}
