import { NextRequest, NextResponse } from 'next/server'
import { getActiveCampaigns, createAffiliateLink, getWalletLinks } from '@/lib/affiliate'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  const mode = req.nextUrl.searchParams.get('mode') ?? 'campaigns'

  if (mode === 'my-links' && wallet) {
    const links = await getWalletLinks(wallet)
    return NextResponse.json({ links })
  }

  const campaigns = await getActiveCampaigns()
  return NextResponse.json({ campaigns })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet || !/^0x[0-9a-fA-F]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 401 })
  }

  const { campaign_id, target_url, campaign_name } = await req.json()
  if (!campaign_id || !target_url || !campaign_name) {
    return NextResponse.json({ error: 'campaign_id, target_url, campaign_name required' }, { status: 400 })
  }

  const link = await createAffiliateLink(campaign_id, wallet, target_url, campaign_name)
  return NextResponse.json({ link }, { status: 201 })
}
