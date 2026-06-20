import { NextRequest, NextResponse } from 'next/server'
import { searchVideos, recordSearch } from '@/lib/search-v2'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  const query = req.nextUrl.searchParams.get('q') ?? ''
  const minViews = req.nextUrl.searchParams.get('minViews')

  if (query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const results = await searchVideos(query, {
    minViews: minViews ? Number(minViews) : undefined,
  })

  if (wallet && /^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    await recordSearch(wallet, query, results.length).catch(() => {})
  }

  return NextResponse.json({ results, total: results.length, query })
}
