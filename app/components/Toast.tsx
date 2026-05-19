'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'default' | 'success' | 'error'

interface ToastMessage {
  id: number
  message: string
  variant: ToastVariant
}

let toastCount = 0
const subscribers = new Set<(t: ToastMessage) => void>()

/** Call this anywhere — no context needed */
export function toast(message: string, variant: ToastVariant = 'default') {
  const t: ToastMessage = { id: ++toastCount, message, variant }
  subscribers.forEach((fn) => fn(t))
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    function handler(t: ToastMessage) {
      setToasts((prev) => [...prev, t])
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id))
        timers.current.delete(t.id)
      }, 3500)
      timers.current.set(t.id, timer)
    }
    subscribers.add(handler)
    return () => {
      subscribers.delete(handler)
      timers.current.forEach((t) => clearTimeout(t))
    }
  }, [])

  return (
    <div className="pointer-events-none fixed bottom-24 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto w-full max-w-xs rounded-2xl px-4 py-3 text-sm font-medium shadow-lg',
            'animate-[fadeInUp_0.2s_ease-out]',
            t.variant === 'success' && 'bg-accent text-bg',
            t.variant === 'error' && 'bg-danger text-white',
            t.variant === 'default' && 'bg-card text-primary',
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
