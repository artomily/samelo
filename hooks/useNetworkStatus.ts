import { useState, useEffect } from 'react'

interface NetworkStatus {
  isOnline: boolean
  effectiveType: string | null
  downlink: number | null
  rtt: number | null
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    effectiveType: null,
    downlink: null,
    rtt: null,
  })

  useEffect(() => {
    const update = () => {
      const conn = (navigator as unknown as { connection?: { effectiveType: string; downlink: number; rtt: number } }).connection
      setStatus({
        isOnline: navigator.onLine,
        effectiveType: conn?.effectiveType ?? null,
        downlink: conn?.downlink ?? null,
        rtt: conn?.rtt ?? null,
      })
    }

    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    update()

    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  return status
}
