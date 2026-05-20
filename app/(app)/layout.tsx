import { BottomNav } from '@/app/components/BottomNav'

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="pb-nav">
      {children}
      <BottomNav />
    </div>
  )
}
