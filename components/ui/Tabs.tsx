'use client'

import { ReactNode, useState } from 'react'

interface Tab {
  key: string
  label: string
  content: ReactNode
}

interface Props {
  tabs: Tab[]
  defaultTab?: string
  className?: string
}

export function Tabs({ tabs, defaultTab, className = '' }: Props) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.key)
  const activeTab = tabs.find(t => t.key === active)

  return (
    <div className={className}>
      <div className="flex gap-1 border-b border-white/10 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors -mb-px border-b-2 ${
              active === tab.key
                ? 'text-[#c8f135] border-[#c8f135]'
                : 'text-white/50 border-transparent hover:text-white/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{activeTab?.content}</div>
    </div>
  )
}
