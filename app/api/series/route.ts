import { NextRequest, NextResponse } from 'next/server'
import { getPublicSeries, getCreatorSeries, createSeries } from '@/lib/content-series'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  const mine = req.nextUrl.searchParams.get('mine') === '1'

  if (mine && wallet) {
    const series = await getCreatorSeries(wallet)
    return NextResponse.json({ series })
  }

  const series = await getPublicSeries()
  return NextResponse.json({ series })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { title, description, cover_url, is_public } = await req.json()
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })

  const series = await createSeries(wallet, title, { description, coverUrl: cover_url, isPublic: is_public })
  return NextResponse.json({ series }, { status: 201 })
}
