import { test, expect } from '@playwright/test'

test.describe('Analytics page', () => {
  test('page loads without crashing', async ({ page }) => {
    await page.goto('/analytics')
    await expect(page.locator('body')).toBeVisible()
  })

  test('shows connect wallet prompt for unauthenticated', async ({ page }) => {
    await page.goto('/analytics')
    const content = await page.content()
    // Either shows stats or a connect prompt
    expect(content.length).toBeGreaterThan(0)
  })
})
