import { ConnectGuard } from '@/app/components/ConnectGuard'
import { HomeScreen } from '@/app/components/HomeScreen'

export default function Home() {
  return (
    <ConnectGuard>
      <HomeScreen />
    </ConnectGuard>
  )
}
