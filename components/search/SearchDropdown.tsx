'use client'
import { useSearch } from '@/hooks/useSearch'
import { SearchInput } from './SearchInput'
import { SearchResultItem } from './SearchResultItem'
import { Skeleton } from '@/components/ui/Skeleton'

export function SearchDropdown() {
  const { query, setQuery, clear, results, isLoading, hasQuery } = useSearch()

  return (
    <div className="relative w-full max-w-md">
      <SearchInput value={query} onChange={setQuery} onClear={clear} autoFocus />

      {hasQuery && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-[#0d0d0d] border border-white/10 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-center px-3 py-2">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2.5 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-sm text-white/30">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="p-2">
              {results.map((result, i) => (
                <SearchResultItem key={`${result.type}-${result.id}-${i}`} result={result} onClick={clear} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
