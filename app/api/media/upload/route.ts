import { NextRequest, NextResponse } from 'next/server'
import { createUploadRecord } from '@/lib/media-uploads'
import { isVideoAllowed, isImageAllowed, MAX_VIDEO_SIZE_BYTES, MAX_IMAGE_SIZE_BYTES } from '@/lib/types/media-upload'
import type { UploadType } from '@/lib/types/media-upload'

const IMAGE_TYPES: UploadType[] = ['thumbnail', 'avatar', 'banner']

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  const { file_name, file_size, mime_type, upload_type } = await req.json()
  if (!file_name || !file_size || !mime_type || !upload_type) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const isImage = IMAGE_TYPES.includes(upload_type as UploadType)
  if (isImage && !isImageAllowed(mime_type)) {
    return NextResponse.json({ error: 'Invalid image type' }, { status: 400 })
  }
  if (!isImage && !isVideoAllowed(mime_type)) {
    return NextResponse.json({ error: 'Invalid video type' }, { status: 400 })
  }
  const maxSize = isImage ? MAX_IMAGE_SIZE_BYTES : MAX_VIDEO_SIZE_BYTES
  if (file_size > maxSize) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 })
  }

  const upload = await createUploadRecord(wallet, file_name, file_size, mime_type, upload_type as UploadType)
  return NextResponse.json({ upload }, { status: 201 })
}
