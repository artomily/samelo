'use client'
import { useNotificationPreferences, useUpdateNotificationPreferences } from '@/hooks/useNotificationPreferences'
import { NOTIFICATION_ICONS, type NotificationType } from '@/lib/types/notification'

const PREF_KEYS: { key: NotificationType; label: string }[] = [
  { key: 'achievement', label: 'Achievements' },
  { key: 'reward', label: 'Rewards' },
  { key: 'social', label: 'Social' },
  { key: 'swap', label: 'Swaps' },
  { key: 'stake', label: 'Staking' },
  { key: 'system', label: 'System' },
]

export function NotificationPreferencesForm() {
  const { data: prefs, isLoading } = useNotificationPreferences()
  const { mutate: update, isPending } = useUpdateNotificationPreferences()

  if (isLoading) return <div className="animate-pulse h-48 bg-white/5 rounded-xl" />

  return (
    <div className="space-y-3">
      {PREF_KEYS.map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between py-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span>{NOTIFICATION_ICONS[key]}</span>
            <span className="text-sm text-white/80">{label}</span>
          </div>
          <button
            role="switch"
            aria-checked={prefs?.[key] ?? true}
            disabled={isPending}
            onClick={() => update({ [key]: !(prefs?.[key] ?? true) })}
            className={`w-10 h-5 rounded-full transition-colors relative disabled:opacity-50 ${
              prefs?.[key] !== false ? 'bg-[#c8f135]' : 'bg-white/20'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                prefs?.[key] !== false ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  )
}
