import { NextRequest, NextResponse } from 'next/server'
import { getCollectionWithItems, addItemToCollection, removeItemFromCollection, setFeatured } from '@/lib/content-curation'
import { isAdmin } from '@/lib/admin-auth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const collection = await getCollectionWithItems(params.id)
  if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ collection })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { action, video_id, note } = await req.json()

  if (action === 'add_item') {
    if (!video_id) return NextResponse.json({ error: 'video_id required' }, { status: 400 })
    const item = await addItemToCollection(params.id, video_id, wallet, note ?? null)
    return NextResponse.json({ item }, { status: 201 })
  }

  if (action === 'remove_item') {
    if (!video_id) return NextResponse.json({ error: 'video_id required' }, { status: 400 })
    await removeItemFromCollection(params.id, video_id)
    return NextResponse.json({ ok: true })
  }

  if (action === 'set_featured') {
    if (!isAdmin(wallet)) return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    const { featured } = await req.json()
    await setFeatured(params.id, !!featured)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
