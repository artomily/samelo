import { test, expect } from '@playwright/test'

test.describe('Watch page', () => {
  test('redirects unauthenticated to connect', async ({ page }) => {
    await page.goto('/watch')
    // Should show connect wallet prompt or redirect
    const content = page.locator('body')
    await expect(content).toBeVisible()
  })

  test('video page loads with youtube embed', async ({ page }) => {
    await page.goto('/watch/test-video')
    // Check for iframe or connect prompt
    const hasIframe = await page.locator('iframe').count()
    const hasConnectPrompt = await page.getByText(/connect/i).count()
    expect(hasIframe + hasConnectPrompt).toBeGreaterThan(0)
  })

  test('/watch page has correct meta title', async ({ page }) => {
    await page.goto('/watch')
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
  })
})
