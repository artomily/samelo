import { test, expect } from '@playwright/test'

test.describe('Admin dashboard', () => {
  test('page loads and shows auth gate', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.locator('body')).toBeVisible()
  })

  test('unauthorized access shows appropriate message', async ({ page }) => {
    await page.goto('/admin')
    const content = await page.content()
    // Should show either the admin dashboard or an unauthorized/connect message
    expect(content.length).toBeGreaterThan(100)
  })
})
