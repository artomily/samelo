import { NextRequest, NextResponse } from 'next/server'
import { addBookmark, getWalletBookmarks, removeBookmark } from '@/lib/video-bookmarks'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const bookmarks = await getWalletBookmarks(wallet)
  return NextResponse.json({ bookmarks })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { video_id, timestamp_ms, note, is_private = true } = await req.json()
  if (!video_id) return NextResponse.json({ error: 'video_id required' }, { status: 400 })

  const bookmark = await addBookmark(wallet, video_id, { timestampMs: timestamp_ms, note, isPrivate: is_private })
  return NextResponse.json({ bookmark }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  await removeBookmark(id, wallet)
  return NextResponse.json({ ok: true })
}
