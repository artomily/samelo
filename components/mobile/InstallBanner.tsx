'use client'

import { usePwa } from '@/hooks/usePwa'

export function InstallBanner() {
  const { canInstall, install, isInstalled } = usePwa()

  if (isInstalled || !canInstall) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-[#1a1a1a] border border-[#c8f135]/30 rounded-2xl p-4 shadow-xl flex items-center gap-3">
      <div className="w-10 h-10 bg-[#c8f135] rounded-xl flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
        S
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">Install Samelo</p>
        <p className="text-xs text-white/50">Watch & earn anywhere, offline ready</p>
      </div>
      <button
        onClick={install}
        className="px-3 py-1.5 bg-[#c8f135] text-black text-xs font-bold rounded-lg flex-shrink-0"
      >
        Install
      </button>
    </div>
  )
}
