import { test, expect, Page } from '@playwright/test'

const humanDelayInMs = 100
const botDelayInMs = 1

test.describe('The Button', () => {
  // This file runs tests sequentially, because each test builds on
  // state established by the previous test.
  test.describe.configure({ mode: 'serial' })

  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('visiting the button without logging in shows a sign up button, but not The Button', async () => {
    await page.goto('/projects/the_button/')
    const signupLink = page.getByRole('link', { name: 'Sign up to play!' })
    await expect(signupLink).toBeVisible()
    await expect(page.getByRole('button', { name: 'The Button' })).not.toBeVisible()
  })

  test('clicking sign up button sends user to signup page', async () => {
    await page.getByRole('link', { name: 'Sign up to play!' }).click()
    await expect(page).toHaveURL('/signup/')
  })

  test('signing a new user redirects to the button page, logged in', async () => {
    await page.getByRole('textbox', { name: 'Username' }).fill('e2e-tests')
    await page.locator('input#new-password').fill('password')
    await page.getByRole('button', { name: 'Sign Up' }).click()
    await expect(page).toHaveURL('/projects/the_button/')
    await expect(page.getByRole('heading', { name: 'Welcome, e2e-tests' })).toBeVisible()
  })

  test('once logged in, The Button is visible, but not the sign up button', async () => {
    await expect(page.locator('button.thebutton')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign up to play!' })).not.toBeVisible()
  })

  test('clicking The Button 5 times like a human updates score and the leaderboard', async () => {
    const theButton = page.locator('button.thebutton')
    await theButton.click({ clickCount: 5, delay: humanDelayInMs })
    await expect(page.locator('span#your-score')).toHaveText('5')
    await expect(page.locator('span#score-e2e-tests')).toHaveText('5')
  })

  test('clicking The Button 5 more times like a bot does not update the score or the leaderboard', async () => {
    const theButton = page.locator('button.thebutton')
    await theButton.click({ clickCount: 5, delay: botDelayInMs })
    await expect(page.locator('span#your-score')).toHaveText('5')
    await expect(page.locator('span#score-e2e-tests')).toHaveText('5')
  })

  test('screenshot diff', async () => {
    await expect(page).toHaveScreenshot({ fullPage: true })
  })

  test('screenshot diff - dark mode', async () => {
    await page.getByRole('button', { name: 'Toggle between Dark and Light mode' }).click()
    await expect(page).toHaveScreenshot({ fullPage: true })
  })
})
