'use client'
import { SearchInput } from '@/components/search/SearchInput'
import { SearchResultItem } from '@/components/search/SearchResultItem'
import { useSearch } from '@/hooks/useSearch'
import { Skeleton } from '@/components/ui/Skeleton'

export default function SearchPage() {
  const { query, setQuery, clear, results, isLoading, hasQuery, total } = useSearch()

  return (
    <main className="min-h-screen bg-[#030303] text-white px-4 py-8 max-w-lg mx-auto">
      <h1 className="font-display text-2xl text-[#c8f135] mb-6">Search</h1>

      <div className="mb-6">
        <SearchInput value={query} onChange={setQuery} onClear={clear} autoFocus />
      </div>

      {!hasQuery && (
        <p className="text-sm text-white/30 text-center mt-12">
          Type to search videos, playlists, and users
        </p>
      )}

      {hasQuery && (
        <>
          {!isLoading && (
            <p className="text-xs text-white/30 mb-3">
              {total} result{total !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
          )}
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex gap-3 px-3 py-2">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-2.5 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm text-white/40">No results found</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {results.map((r, i) => (
                <SearchResultItem key={`${r.type}-${r.id}-${i}`} result={r} onClick={clear} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}
