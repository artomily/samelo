'use client'

import type { VideoCollection } from '@/lib/types/content-curation'

interface Props {
  collection: VideoCollection
  onClick?: () => void
}

export function CollectionCard({ collection, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg overflow-hidden cursor-pointer hover:border-[#c8f135]/40 transition-colors"
    >
      {collection.cover_url ? (
        <img src={collection.cover_url} alt={collection.title} className="w-full h-32 object-cover" />
      ) : (
        <div className="w-full h-32 bg-[#111] flex items-center justify-center">
          <span className="text-3xl">📂</span>
        </div>
      )}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          {collection.is_featured && (
            <span className="text-[10px] font-bold text-[#030303] bg-[#c8f135] px-1.5 py-0.5 rounded uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>
        <h3 className="font-semibold text-sm text-white font-[Orbitron] truncate">{collection.title}</h3>
        {collection.description && (
          <p className="text-xs text-[#666] mt-1 line-clamp-2">{collection.description}</p>
        )}
        <p className="text-[10px] text-[#444] mt-2 font-mono">
          {collection.curator_wallet.slice(0, 6)}…{collection.curator_wallet.slice(-4)}
        </p>
      </div>
    </div>
  )
}
