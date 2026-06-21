import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Course, CourseWithLessons, CourseEnrollment } from '@/lib/types/creator-courses'

export function usePublishedCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await fetch('/api/courses')
      if (!res.ok) throw new Error('Failed to fetch courses')
      return res.json() as Promise<{ courses: Course[] }>
    },
  })
}

export function useCourseDetail(id: string, wallet?: string) {
  return useQuery({
    queryKey: ['course', id, wallet],
    queryFn: async () => {
      const res = await fetch(`/api/courses/${id}`, {
        headers: wallet ? { 'x-wallet-address': wallet } : {},
      })
      if (!res.ok) throw new Error('Failed to fetch course')
      return res.json() as Promise<{ course: CourseWithLessons }>
    },
    enabled: !!id,
  })
}

export function useMyEnrollments(wallet?: string) {
  return useQuery({
    queryKey: ['enrollments', wallet],
    queryFn: async () => {
      const res = await fetch('/api/courses?enrolled=1', {
        headers: { 'x-wallet-address': wallet! },
      })
      if (!res.ok) throw new Error('Failed to fetch enrollments')
      return res.json() as Promise<{ enrollments: CourseEnrollment[] }>
    },
    enabled: !!wallet,
  })
}

export function useEnrollCourse(wallet: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ courseId, paidMelo = 0 }: { courseId: string; paidMelo?: number }) => {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-wallet-address': wallet },
        body: JSON.stringify({ action: 'enroll', paid_melo: paidMelo }),
      })
      if (!res.ok) throw new Error('Enrollment failed')
      return res.json()
    },
    onSuccess: (_data, { courseId }) => {
      qc.invalidateQueries({ queryKey: ['course', courseId] })
      qc.invalidateQueries({ queryKey: ['enrollments', wallet] })
    },
  })
}
