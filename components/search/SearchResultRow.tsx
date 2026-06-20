'use client'

import { RESULT_TYPE_ICONS, SEARCH_LABELS } from '@/lib/types/search'
import type { SearchResultV2 } from '@/lib/types/search-v2'

interface Props {
  result: SearchResultV2
}

export function SearchResultRow({ result }: Props) {
  const icon = RESULT_TYPE_ICONS[result.type as keyof typeof RESULT_TYPE_ICONS] ?? '▶'
  const label = SEARCH_LABELS[result.type as keyof typeof SEARCH_LABELS] ?? result.type

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors cursor-pointer">
      <span className="text-sm text-white/40 flex-shrink-0 w-5 text-center">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{result.title}</p>
        {result.subtitle && <p className="text-xs text-white/40 truncate">{result.subtitle}</p>}
      </div>
      <span className="text-xs text-white/30 flex-shrink-0">{label}</span>
    </div>
  )
}
