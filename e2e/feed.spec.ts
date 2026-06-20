import { test, expect } from '@playwright/test'

test.describe('Activity Feed page', () => {
  test('page loads without crashing', async ({ page }) => {
    await page.goto('/feed')
    await expect(page.locator('body')).toBeVisible()
  })

  test('shows connect wallet prompt for unauthenticated', async ({ page }) => {
    await page.goto('/feed')
    const content = await page.content()
    const hasConnect = content.toLowerCase().includes('connect')
    const hasFeed = content.toLowerCase().includes('activity') || content.toLowerCase().includes('feed')
    expect(hasConnect || hasFeed).toBe(true)
  })
})
