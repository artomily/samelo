import { NotificationList } from '@/components/notifications/NotificationList'
import { NotificationPreferencesForm } from '@/components/notifications/NotificationPreferencesForm'

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-[#030303] text-white px-4 py-8 max-w-lg mx-auto">
      <h1 className="font-display text-2xl text-[#c8f135] mb-6">Notifications</h1>

      <section className="mb-8">
        <NotificationList />
      </section>

      <section>
        <h2 className="text-sm text-white/40 uppercase tracking-wide mb-4">Preferences</h2>
        <NotificationPreferencesForm />
      </section>
    </main>
  )
}
