'use client'
import { useEffect, useRef } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import { NOTIFICATION_ICONS } from '@/lib/types/notification'
import type { Notification } from '@/lib/types/notification'

export function NotificationToastProvider() {
  const { data } = useNotifications()
  const prevUnread = useRef(0)
  const toastRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const current = data?.unreadCount ?? 0
    if (current > prevUnread.current && prevUnread.current > 0) {
      const newest = data?.notifications[0]
      if (newest && !newest.read_at) {
        showToast(newest, toastRef)
      }
    }
    prevUnread.current = current
  }, [data?.unreadCount])

  return (
    <div
      ref={toastRef}
      className="fixed bottom-4 right-4 z-[100] pointer-events-none"
      aria-live="polite"
    />
  )
}

function showToast(notification: Notification, ref: React.RefObject<HTMLDivElement | null>) {
  if (!ref.current) return
  const el = document.createElement('div')
  el.className =
    'pointer-events-auto flex items-start gap-3 bg-[#0d0d0d] border border-[#c8f135]/30 rounded-xl p-3 shadow-xl animate-in slide-in-from-bottom-2 duration-200 max-w-[280px]'
  el.innerHTML = `
    <span class="text-lg flex-shrink-0">${NOTIFICATION_ICONS[notification.type]}</span>
    <div>
      <p class="text-sm font-medium text-white">${notification.title}</p>
      <p class="text-xs text-white/50 mt-0.5">${notification.body}</p>
    </div>
  `
  ref.current.appendChild(el)
  setTimeout(() => el.remove(), 4000)
}
