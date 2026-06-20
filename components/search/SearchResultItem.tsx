'use client'
import type { SearchResult } from '@/lib/types/search'
import { SEARCH_ICONS, SEARCH_LABELS } from '@/lib/types/search'
import Link from 'next/link'

interface SearchResultItemProps {
  result: SearchResult
  onClick?: () => void
}

function getResultHref(result: SearchResult): string {
  switch (result.type) {
    case 'video': return `/watch/${result.id}`
    case 'playlist': return `/playlists/${result.id}`
    case 'profile': return `/profile/${result.id}`
    default: return '/'
  }
}

export function SearchResultItem({ result, onClick }: SearchResultItemProps) {
  return (
    <Link
      href={getResultHref(result)}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors group"
    >
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-sm">
        {result.thumbnailUrl ? (
          <img src={result.thumbnailUrl} alt="" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <span>{SEARCH_ICONS[result.type]}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate group-hover:text-[#c8f135] transition-colors">
          {result.title}
        </p>
        {result.subtitle && (
          <p className="text-xs text-white/40 truncate">{result.subtitle}</p>
        )}
      </div>
      <span className="text-xs text-white/20 flex-shrink-0">{SEARCH_LABELS[result.type]}</span>
    </Link>
  )
}
