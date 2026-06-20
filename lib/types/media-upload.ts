export type UploadType = 'video' | 'thumbnail' | 'avatar' | 'banner'
export type UploadStatus = 'pending' | 'processing' | 'ready' | 'failed'

export interface MediaUpload {
  id: string
  wallet: string
  file_name: string
  file_size: number
  mime_type: string
  storage_path: string
  public_url: string | null
  upload_type: UploadType
  status: UploadStatus
  duration_seconds: number | null
  width: number | null
  height: number | null
  created_at: string
  ready_at: string | null
}

export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const MAX_VIDEO_SIZE_BYTES = 500 * 1024 * 1024
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024

export function isVideoAllowed(mimeType: string): boolean {
  return ALLOWED_VIDEO_TYPES.includes(mimeType)
}

export function isImageAllowed(mimeType: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(mimeType)
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export function buildStoragePath(wallet: string, uploadType: UploadType, fileName: string): string {
  const ts = Date.now()
  const ext = fileName.split('.').pop() ?? 'bin'
  return `${uploadType}/${wallet}/${ts}.${ext}`
}
