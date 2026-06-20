import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test('renders hero headline', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('has connect wallet CTA', async ({ page }) => {
    await page.goto('/')
    const cta = page.getByRole('button', { name: /connect/i })
    await expect(cta).toBeVisible()
  })

  test('title contains Samelo', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Samelo/)
  })

  test('navigation links are present', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })
})
