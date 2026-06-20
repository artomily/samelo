export type EventStatus = 'scheduled' | 'live' | 'ended' | 'cancelled'

export interface LiveEvent {
  id: string
  title: string
  description: string | null
  host_wallet: string
  stream_url: string | null
  thumbnail_url: string | null
  scheduled_at: string
  started_at: string | null
  ended_at: string | null
  status: EventStatus
  max_attendees: number | null
  points_reward: number
  created_at: string
}

export interface LiveEventRsvp {
  id: string
  event_id: string
  wallet: string
  reminded: boolean
  attended: boolean
  points_awarded: boolean
  created_at: string
}

export const STATUS_LABELS: Record<EventStatus, string> = {
  scheduled: 'Scheduled',
  live: 'Live Now',
  ended: 'Ended',
  cancelled: 'Cancelled',
}

export const STATUS_COLORS: Record<EventStatus, string> = {
  scheduled: '#888',
  live: '#c8f135',
  ended: '#444',
  cancelled: '#f13535',
}

export function isUpcoming(event: LiveEvent): boolean {
  return event.status === 'scheduled' && new Date(event.scheduled_at) > new Date()
}

export function formatEventTime(scheduledAt: string): string {
  const d = new Date(scheduledAt)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
