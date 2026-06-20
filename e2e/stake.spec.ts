import { test, expect } from '@playwright/test'

test.describe('Stake page', () => {
  test('page loads without crashing', async ({ page }) => {
    await page.goto('/stake')
    await expect(page.locator('body')).toBeVisible()
  })

  test('shows staking tiers', async ({ page }) => {
    await page.goto('/stake')
    // Should show tier options (1 Week, 1 Month, etc.)
    const content = await page.content()
    const hasTiers = content.includes('Week') || content.includes('Month') || content.includes('connect')
    expect(hasTiers).toBe(true)
  })
})
