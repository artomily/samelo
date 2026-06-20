import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePwa() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const handlePrompt = (e: Event) => setInstallPrompt(e as BeforeInstallPromptEvent)
    window.addEventListener('beforeinstallprompt', handlePrompt)

    const mq = window.matchMedia('(display-mode: standalone)')
    setIsInstalled(mq.matches)
    const handleChange = (e: MediaQueryListEvent) => setIsInstalled(e.matches)
    mq.addEventListener('change', handleChange)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handlePrompt)
      mq.removeEventListener('change', handleChange)
    }
  }, [])

  const install = async () => {
    if (!installPrompt) return false
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    setInstallPrompt(null)
    return outcome === 'accepted'
  }

  return { install, isInstalled, isOnline, canInstall: !!installPrompt }
}
