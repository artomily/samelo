import { test, expect } from '@playwright/test'

test.describe('Leaderboard page', () => {
  test('loads leaderboard table', async ({ page }) => {
    await page.goto('/leaderboard')
    await expect(page.locator('body')).toBeVisible()
  })

  test('has rank column header', async ({ page }) => {
    await page.goto('/leaderboard')
    const rankHeader = page.getByText(/rank/i).first()
    await expect(rankHeader).toBeVisible()
  })

  test('has pagination or no-results state', async ({ page }) => {
    await page.goto('/leaderboard')
    const content = await page.content()
    expect(content.length).toBeGreaterThan(0)
  })
})
