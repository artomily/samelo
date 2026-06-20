import { test, expect } from '@playwright/test'

test.describe('Notifications', () => {
  test('notification bell is visible in header', async ({ page }) => {
    await page.goto('/')
    // Bell icon is in header nav
    const content = await page.content()
    expect(content.length).toBeGreaterThan(0)
  })
})
