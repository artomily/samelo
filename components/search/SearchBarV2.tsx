'use client'

import { useState, useRef, useEffect } from 'react'
import { parseSearchQuery } from '@/lib/types/search-v2'

interface Props {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchBarV2({ onSearch, placeholder = 'Search videos, playlists, creators…' }: Props) {
  const [value, setValue] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setValue(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (q.length >= 2 || q.length === 0) onSearch(q)
    }, 300)
  }

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }, [])

  const { tags } = parseSearchQuery(value)

  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30 transition-colors"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">⌕</span>
      {tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#c8f135', color: '#030303' }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
