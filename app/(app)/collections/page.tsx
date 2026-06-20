'use client'

import { useState } from 'react'
import { CollectionGrid } from '@/components/collections/CollectionGrid'
import { useCollectionDetail } from '@/hooks/useContentCuration'
import { sortByPosition } from '@/lib/types/content-curation'

function CollectionDetailView({ id, onBack }: { id: string; onBack: () => void }) {
  const { data, isLoading } = useCollectionDetail(id)
  const collection = data?.collection

  if (isLoading) return <div className="h-64 bg-[#0d0d0d] rounded-lg animate-pulse" />
  if (!collection) return <p className="text-[#666] text-sm">Collection not found</p>

  const items = sortByPosition(collection.items)

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-xs text-[#c8f135] hover:underline">← Back</button>
      <h2 className="text-xl font-bold text-white font-[Orbitron]">{collection.title}</h2>
      {collection.description && <p className="text-sm text-[#888]">{collection.description}</p>}
      <div className="space-y-2 mt-4">
        {items.length === 0 && <p className="text-xs text-[#555]">No videos in this collection</p>}
        {items.map((item, i) => (
          <div key={item.id} className="flex items-center gap-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded p-3">
            <span className="text-xs text-[#444] w-5 text-center">{i + 1}</span>
            <span className="text-sm text-white font-mono truncate">{item.video_id}</span>
            {item.note && <span className="text-xs text-[#555] ml-auto">{item.note}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CollectionsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-[#030303] text-white p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold font-[Orbitron] text-[#c8f135] mb-6">Collections</h1>
      {selectedId ? (
        <CollectionDetailView id={selectedId} onBack={() => setSelectedId(null)} />
      ) : (
        <CollectionGrid onSelect={setSelectedId} />
      )}
    </main>
  )
}
