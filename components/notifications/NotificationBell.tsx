'use client'
import { useState, useRef, useEffect } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import { NotificationList } from './NotificationList'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { data } = useNotifications()
  const unreadCount = data?.unreadCount ?? 0
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 text-white/60 hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-[#c8f135] text-black text-[10px] font-bold flex items-center justify-center leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-[480px] overflow-y-auto bg-[#0d0d0d] border border-white/10 rounded-xl shadow-xl z-50">
          <div className="sticky top-0 bg-[#0d0d0d] border-b border-white/5 px-4 py-3">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
          </div>
          <NotificationList />
        </div>
      )}
    </div>
  )
}
