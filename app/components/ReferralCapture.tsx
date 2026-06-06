'use client'

import { useEffect } from 'react'

export function ReferralCapture() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const params = new URLSearchParams(window.location.search)
      const refCode = params.get('ref')
      if (refCode && refCode.trim()) {
        localStorage.setItem('samelo_ref_code', refCode.trim().toUpperCase())
        // Clean URL without reloading
        const url = new URL(window.location.href)
        url.searchParams.delete('ref')
        window.history.replaceState({}, '', url.toString())
      }
    } catch {
      // Ignore errors
    }
  }, [])

  return null
}
