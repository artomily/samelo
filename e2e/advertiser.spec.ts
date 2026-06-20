import { test, expect } from '@playwright/test'

test.describe('Advertiser portal', () => {
  test('page loads without crashing', async ({ page }) => {
    await page.goto('/advertiser')
    await expect(page.locator('body')).toBeVisible()
  })

  test('shows connect wallet prompt for unauthenticated', async ({ page }) => {
    await page.goto('/advertiser')
    const content = await page.content()
    expect(content.toLowerCase()).toContain('connect')
  })
})
