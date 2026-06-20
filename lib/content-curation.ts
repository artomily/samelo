import { createClient } from '@supabase/supabase-js'
import type { VideoCollection, VideoCollectionItem, VideoCollectionWithItems } from './types/content-curation'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getFeaturedCollections(): Promise<VideoCollection[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('video_collections')
    .select('*')
    .eq('is_featured', true)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getPublicCollections(): Promise<VideoCollection[]> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('video_collections')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(50)
  return data ?? []
}

export async function getCollectionWithItems(id: string): Promise<VideoCollectionWithItems | null> {
  const supabase = getSupabase()
  const { data: collection } = await supabase
    .from('video_collections')
    .select('*')
    .eq('id', id)
    .single()
  if (!collection) return null

  const { data: items } = await supabase
    .from('video_collection_items')
    .select('*')
    .eq('collection_id', id)
    .order('position', { ascending: true })

  return { ...collection, items: items ?? [] }
}

export async function createCollection(
  curatorWallet: string,
  title: string,
  description: string | null,
  coverUrl: string | null
): Promise<VideoCollection> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('video_collections')
    .insert({ curator_wallet: curatorWallet, title, description, cover_url: coverUrl })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function addItemToCollection(
  collectionId: string,
  videoId: string,
  addedBy: string,
  note: string | null
): Promise<VideoCollectionItem> {
  const supabase = getSupabase()
  const { count } = await supabase
    .from('video_collection_items')
    .select('*', { count: 'exact', head: true })
    .eq('collection_id', collectionId)

  const { data, error } = await supabase
    .from('video_collection_items')
    .insert({ collection_id: collectionId, video_id: videoId, added_by: addedBy, note, position: count ?? 0 })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function removeItemFromCollection(collectionId: string, videoId: string): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('video_collection_items')
    .delete()
    .eq('collection_id', collectionId)
    .eq('video_id', videoId)
}

export async function setFeatured(collectionId: string, featured: boolean): Promise<void> {
  const supabase = getSupabase()
  await supabase
    .from('video_collections')
    .update({ is_featured: featured })
    .eq('id', collectionId)
}
