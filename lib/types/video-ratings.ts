export interface VideoRating {
  id: string
  wallet: string
  video_id: string
  rating: number
  review: string | null
  watch_pct_at_rating: number | null
  created_at: string
  updated_at: string
}

export interface VideoRatingStats {
  video_id: string
  rating_count: number
  rating_sum: number
  avg_rating: number
  updated_at: string
}

export function starLabel(rating: number): string {
  const labels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Great',
    5: 'Excellent',
  }
  return labels[rating] ?? 'Unknown'
}

export function renderStars(rating: number, maxStars = 5): string {
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(maxStars - Math.round(rating))
}

export function ratingColor(rating: number): string {
  if (rating >= 4) return '#c8f135'
  if (rating >= 3) return '#f1c135'
  return '#f13535'
}
