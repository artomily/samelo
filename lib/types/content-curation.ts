export interface VideoCollection {
  id: string
  title: string
  description: string | null
  cover_url: string | null
  curator_wallet: string
  is_featured: boolean
  is_public: boolean
  created_at: string
}

export interface VideoCollectionItem {
  id: string
  collection_id: string
  video_id: string
  position: number
  added_by: string
  note: string | null
  created_at: string
}

export interface VideoCollectionWithItems extends VideoCollection {
  items: VideoCollectionItem[]
}

export function isOwner(collection: VideoCollection, wallet: string): boolean {
  return collection.curator_wallet.toLowerCase() === wallet.toLowerCase()
}

export function sortByPosition(items: VideoCollectionItem[]): VideoCollectionItem[] {
  return [...items].sort((a, b) => a.position - b.position)
}
