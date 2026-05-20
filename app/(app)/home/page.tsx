'use client'

import { ConnectGuard } from '@/app/components/ConnectGuard'
import { HomeScreen } from '@/app/components/HomeScreen'

export default function HomePage() {
  return (
    <ConnectGuard>
      <HomeScreen />
    </ConnectGuard>
  )
}
