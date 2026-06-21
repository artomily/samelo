import { NextRequest, NextResponse } from 'next/server'
import { getPublishedCourses, createCourse, getWalletEnrollments } from '@/lib/creator-courses'

export async function GET(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  const enrolled = req.nextUrl.searchParams.get('enrolled') === '1'

  if (enrolled && wallet) {
    const enrollments = await getWalletEnrollments(wallet)
    return NextResponse.json({ enrollments })
  }

  const courses = await getPublishedCourses()
  return NextResponse.json({ courses })
}

export async function POST(req: NextRequest) {
  const wallet = req.headers.get('x-wallet-address')
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 401 })

  const { title, description, skill_level, price_melo, estimated_minutes } = await req.json()
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })

  const course = await createCourse(wallet, title, {
    description,
    skillLevel: skill_level,
    priceMelo: price_melo,
    estimatedMinutes: estimated_minutes,
  })
  return NextResponse.json({ course }, { status: 201 })
}
