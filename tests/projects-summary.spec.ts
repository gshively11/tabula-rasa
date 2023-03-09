import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/projects/summary/')
})

test('screenshot diff', async ({ page }) => {
  await expect(page).toHaveScreenshot({ fullPage: true, timeout: 15000 })
})

test('screenshot diff - dark mode', async ({ page }) => {
  await page.getByRole('button', { name: 'Toggle between Dark and Light mode' }).click()
  await expect(page).toHaveScreenshot({ fullPage: true, timeout: 15000 })
})
