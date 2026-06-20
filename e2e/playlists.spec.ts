import { test, expect } from '@playwright/test'

test.describe('Playlists page', () => {
  test('page loads without crashing', async ({ page }) => {
    await page.goto('/playlists')
    await expect(page.locator('body')).toBeVisible()
  })

  test('has page heading', async ({ page }) => {
    await page.goto('/playlists')
    const heading = page.getByRole('heading').first()
    await expect(heading).toBeVisible()
  })
})
