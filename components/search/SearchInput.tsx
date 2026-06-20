'use client'
import { useRef, useEffect } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder?: string
  autoFocus?: boolean
}

export function SearchInput({ value, onChange, onClear, placeholder = 'Search videos, playlists, users…', autoFocus }: SearchInputProps) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) ref.current?.focus()
  }, [autoFocus])

  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-white/30 pointer-events-none">🔍</span>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c8f135]/50 transition-colors"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 text-white/30 hover:text-white/60 transition-colors"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  )
}
