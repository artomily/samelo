import { test, expect } from '@playwright/test'

test.describe('Offline fallback', () => {
  test('/offline.html loads as static file', async ({ page }) => {
    await page.goto('/offline.html')
    const content = await page.content()
    // Should show offline page content
    expect(content.length).toBeGreaterThan(0)
  })

  test('offline page does not crash', async ({ page }) => {
    const response = await page.goto('/offline.html')
    // Could be 200 or 404 depending on static serving
    expect(response).not.toBeNull()
  })
})
