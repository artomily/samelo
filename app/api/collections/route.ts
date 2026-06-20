import { NextRequest, NextResponse } from 'next/server'
import { getFeaturedCollections, getPublicCollections, createCollection } from '@/lib/content-curation'

export async function GET(req: NextRequest) {
  const featured = req.nextUrl.searchParams.get('featured') === 'true'
  const collections = featured ? await getFeaturedCollections() : await getPublicCollections()
  return NextResponse.json({ collections })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { title, description, cover_url } = await req.json()
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'title required' }, { status: 400 })
  }

  const collection = await createCollection(wallet, title, description ?? null, cover_url ?? null)
  return NextResponse.json({ collection }, { status: 201 })
}
