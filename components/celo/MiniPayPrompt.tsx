'use client'
import { isMiniPay } from '@/lib/celo/wallet'
import { useEffect, useState } from 'react'

interface MiniPayPromptProps {
  children: React.ReactNode
}

export function MiniPayPrompt({ children }: MiniPayPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    setShowPrompt(!isMiniPay())
  }, [])

  if (!showPrompt) return <>{children}</>

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-6 text-center">
      <div className="text-4xl mb-4">📱</div>
      <h1 className="font-display text-2xl text-white mb-2">Open in MiniPay</h1>
      <p className="text-white/50 text-sm max-w-xs mb-6">
        Samelo is designed for MiniPay. Open this link from your MiniPay wallet browser for the
        best experience.
      </p>
      <button
        onClick={() => setShowPrompt(false)}
        className="text-xs text-white/30 hover:text-white/50 underline transition-colors"
      >
        Continue anyway
      </button>
    </div>
  )
}
