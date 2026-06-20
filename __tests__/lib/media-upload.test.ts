import { describe, it, expect } from 'vitest'
import {
  isVideoAllowed,
  isImageAllowed,
  formatFileSize,
  buildStoragePath,
  ALLOWED_VIDEO_TYPES,
  ALLOWED_IMAGE_TYPES,
  MAX_VIDEO_SIZE_BYTES,
  MAX_IMAGE_SIZE_BYTES,
} from '@/lib/types/media-upload'

describe('isVideoAllowed', () => {
  it('allows mp4', () => expect(isVideoAllowed('video/mp4')).toBe(true))
  it('allows webm', () => expect(isVideoAllowed('video/webm')).toBe(true))
  it('rejects pdf', () => expect(isVideoAllowed('application/pdf')).toBe(false))
})

describe('isImageAllowed', () => {
  it('allows jpeg', () => expect(isImageAllowed('image/jpeg')).toBe(true))
  it('allows webp', () => expect(isImageAllowed('image/webp')).toBe(true))
  it('rejects mp4', () => expect(isImageAllowed('video/mp4')).toBe(false))
})

describe('formatFileSize', () => {
  it('formats bytes', () => expect(formatFileSize(512)).toBe('512 B'))
  it('formats kilobytes', () => expect(formatFileSize(2048)).toBe('2.0 KB'))
  it('formats megabytes', () => expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB'))
})

describe('buildStoragePath', () => {
  it('includes upload type and wallet', () => {
    const path = buildStoragePath('0xabc', 'video', 'test.mp4')
    expect(path).toMatch(/^video\/0xabc\/\d+\.mp4$/)
  })

  it('uses file extension', () => {
    const path = buildStoragePath('0xabc', 'avatar', 'photo.jpg')
    expect(path).toMatch(/\.jpg$/)
  })
})

describe('size limits', () => {
  it('video limit is 500MB', () => {
    expect(MAX_VIDEO_SIZE_BYTES).toBe(500 * 1024 * 1024)
  })

  it('image limit is 10MB', () => {
    expect(MAX_IMAGE_SIZE_BYTES).toBe(10 * 1024 * 1024)
  })
})
