'use client'

import { useState } from 'react'
import { useNotifications, useUnreadCount, useMarkNotificationsRead } from '@/hooks/useNotifications'
import { NotificationItem } from './NotificationItem'

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const { data } = useNotifications()
  const unread = useUnreadCount()
  const markRead = useMarkNotificationsRead()

  const notifications = data?.notifications ?? []

  const handleMarkAll = () => markRead.mutate(undefined)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="relative p-2 rounded-lg hover:bg-white/5 transition-all"
        aria-label="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/70">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c8f135] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 w-80 z-50 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              {unread > 0 && (
                <button onClick={handleMarkAll} className="text-xs text-[#c8f135] hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
              {notifications.length === 0 ? (
                <p className="text-center text-white/30 text-sm py-8">No notifications yet</p>
              ) : (
                notifications.map(n => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onRead={id => markRead.mutate(id)}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
