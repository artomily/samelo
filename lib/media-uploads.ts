import { createClient } from '@supabase/supabase-js'
import { buildStoragePath } from './types/media-upload'
import type { MediaUpload, UploadType, UploadStatus } from './types/media-upload'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function createUploadRecord(
  wallet: string,
  fileName: string,
  fileSize: number,
  mimeType: string,
  uploadType: UploadType
): Promise<MediaUpload> {
  const supabase = getSupabase()
  const storagePath = buildStoragePath(wallet, uploadType, fileName)
  const { data, error } = await supabase
    .from('media_uploads')
    .insert({
      wallet,
      file_name: fileName,
      file_size: fileSize,
      mime_type: mimeType,
      storage_path: storagePath,
      upload_type: uploadType,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateUploadStatus(
  id: string,
  status: UploadStatus,
  extras?: { public_url?: string; duration_seconds?: number; width?: number; height?: number }
): Promise<void> {
  const supabase = getSupabase()
  const patch: Record<string, unknown> = { status }
  if (status === 'ready') patch.ready_at = new Date().toISOString()
  if (extras?.public_url) patch.public_url = extras.public_url
  if (extras?.duration_seconds) patch.duration_seconds = extras.duration_seconds
  if (extras?.width) patch.width = extras.width
  if (extras?.height) patch.height = extras.height
  const { error } = await supabase.from('media_uploads').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function getWalletUploads(wallet: string, uploadType?: UploadType): Promise<MediaUpload[]> {
  const supabase = getSupabase()
  let q = supabase
    .from('media_uploads')
    .select('*')
    .eq('wallet', wallet)
    .order('created_at', { ascending: false })
  if (uploadType) q = q.eq('upload_type', uploadType)
  const { data, error } = await q
  if (error) throw new Error(error.message)
  return data ?? []
}
