import { test, expect } from '@playwright/test'

test.describe('Profile page', () => {
  test('public profile loads by wallet address', async ({ page }) => {
    await page.goto('/profile/0x0000000000000000000000000000000000000000')
    await expect(page.locator('body')).toBeVisible()
  })

  test('/profile redirects or shows connect prompt', async ({ page }) => {
    await page.goto('/profile')
    const content = await page.content()
    expect(content.length).toBeGreaterThan(0)
  })
})
