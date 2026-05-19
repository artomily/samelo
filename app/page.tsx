import { ConnectGuard } from '@/app/components/ConnectGuard'
import FeedContent from '@/app/components/FeedContent'

export default function Home() {
  return (
    <ConnectGuard>
      <FeedContent />
    </ConnectGuard>
  )
}
