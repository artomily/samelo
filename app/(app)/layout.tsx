import { BottomNav } from '@/app/components/BottomNav'
import { ChainGuard } from '@/app/components/ChainGuard'



export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ChainGuard>
      <div className="pb-nav">
        {children}
        <BottomNav />
      </div>
    </ChainGuard>
  )
}
