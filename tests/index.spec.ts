import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(/ihopethis\.works/)
})

test('has Hire Me button that points to my email address', async ({ page }) => {
  const hireMe = page.getByRole('link', { name: 'Hire Me' })
  await expect(hireMe).toHaveAttribute('href', 'mailto:gshively11+ihopethisworks@gmail.com')
})

test('has Projects button that navigates to project summary', async ({ page }) => {
  await page.getByRole('main').getByRole('link', { name: 'Projects' }).click()
  await expect(page).toHaveURL('/projects/summary/')
})

test('screenshot diff', async ({ page }) => {
  await expect(page).toHaveScreenshot({ fullPage: true, timeout: 15000 })
})

test('screenshot diff - dark mode', async ({ page }) => {
  await page.getByRole('button', { name: 'Toggle between Dark and Light mode' }).click()
  await expect(page).toHaveScreenshot({ fullPage: true, timeout: 15000 })
})
