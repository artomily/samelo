import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { VideoCollection, VideoCollectionWithItems } from '@/lib/types/content-curation'

interface CollectionsResponse {
  collections: VideoCollection[]
}

interface CollectionDetailResponse {
  collection: VideoCollectionWithItems
}

export function useCollections(featured = false) {
  return useQuery<CollectionsResponse>({
    queryKey: ['collections', { featured }],
    queryFn: async () => {
      const url = featured ? '/api/collections?featured=true' : '/api/collections'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to load collections')
      return res.json()
    },
    staleTime: 60_000,
  })
}

export function useCollectionDetail(id: string | undefined) {
  return useQuery<CollectionDetailResponse>({
    queryKey: ['collection', id],
    queryFn: async () => {
      const res = await fetch(`/api/collections/${id}`)
      if (!res.ok) throw new Error('Failed to load collection')
      return res.json()
    },
    enabled: !!id,
    staleTime: 30_000,
  })
}

export function useCreateCollection(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { title: string; description?: string; cover_url?: string }) => {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': wallet ?? '' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to create collection')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['collections'] }),
  })
}

export function useAddToCollection(wallet: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ collectionId, videoId, note }: { collectionId: string; videoId: string; note?: string }) => {
      const res = await fetch(`/api/collections/${collectionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wallet-address': wallet ?? '' },
        body: JSON.stringify({ action: 'add_item', video_id: videoId, note }),
      })
      if (!res.ok) throw new Error('Failed to add item')
      return res.json()
    },
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['collection', vars.collectionId] }),
  })
}
