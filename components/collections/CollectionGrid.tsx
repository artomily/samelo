'use client'

import { useCollections } from '@/hooks/useContentCuration'
import { CollectionCard } from './CollectionCard'

interface Props {
  featured?: boolean
  onSelect?: (id: string) => void
}

export function CollectionGrid({ featured = false, onSelect }: Props) {
  const { data, isLoading } = useCollections(featured)

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-[#0d0d0d] rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  const collections = data?.collections ?? []

  if (collections.length === 0) {
    return (
      <div className="text-center py-12 text-[#444]">
        <p className="text-sm">No collections yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#555] uppercase tracking-widest">
        {featured ? 'Featured' : 'All'} Collections — {collections.length}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {collections.map((c) => (
          <CollectionCard key={c.id} collection={c} onClick={() => onSelect?.(c.id)} />
        ))}
      </div>
    </div>
  )
}
