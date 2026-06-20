'use client'
import { useState, useEffect } from 'react'
import { getSearchHistory, removeFromSearchHistory, clearSearchHistory } from '@/lib/search-history'

interface RecentSearchesProps {
  onSelect: (query: string) => void
}

export function RecentSearches({ onSelect }: RecentSearchesProps) {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    setHistory(getSearchHistory())
  }, [])

  if (history.length === 0) return null

  function handleRemove(q: string) {
    removeFromSearchHistory(q)
    setHistory(getSearchHistory())
  }

  function handleClearAll() {
    clearSearchHistory()
    setHistory([])
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/30 uppercase tracking-wide">Recent</span>
        <button
          onClick={handleClearAll}
          className="text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          Clear all
        </button>
      </div>
      <div className="space-y-1">
        {history.map(q => (
          <div key={q} className="flex items-center justify-between group">
            <button
              onClick={() => onSelect(q)}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors py-1"
            >
              <span className="text-white/20">⏱</span>
              {q}
            </button>
            <button
              onClick={() => handleRemove(q)}
              className="text-white/20 hover:text-white/50 transition-colors opacity-0 group-hover:opacity-100 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
