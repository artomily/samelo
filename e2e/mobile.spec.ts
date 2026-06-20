import { test, expect, devices } from '@playwright/test'

const iphone = devices['iPhone 12']

test.describe('Mobile viewport', () => {
  test.use({ ...iphone })

  test('home page renders on mobile', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
  })

  test('viewport width matches mobile', async ({ page }) => {
    await page.goto('/')
    const width = await page.evaluate(() => window.innerWidth)
    expect(width).toBeLessThan(500)
  })

  test('no horizontal overflow on home', async ({ page }) => {
    await page.goto('/')
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5) // 5px tolerance
  })
})
