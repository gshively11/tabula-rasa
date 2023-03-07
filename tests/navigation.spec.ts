import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('has three main buttons', async ({ page }) => {
  const nav = page.getByRole('navigation')
  await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible()
  await expect(nav.getByRole('button', { name: 'Projects' })).toBeVisible()
  await expect(nav.getByRole('button', { name: 'Socials' })).toBeVisible()
})

test('hovering Projects shows expected links', async ({ page }) => {
  const nav = page.getByRole('navigation')
  await expect(nav.getByRole('link', { name: 'Summary' })).not.toBeVisible()
  await expect(nav.getByRole('link', { name: 'AI-generated Blog' })).not.toBeVisible()
  await expect(nav.getByRole('link', { name: 'The Button' })).not.toBeVisible()
  await nav.getByRole('button', { name: 'Projects' }).hover()
  await expect(nav.getByRole('link', { name: 'Summary' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'AI-generated Blog' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'The Button' })).toBeVisible()
})

test('hovering Socials shows expected links', async ({ page }) => {
  const nav = page.getByRole('navigation')
  await expect(nav.getByRole('link', { name: 'Github' })).not.toBeVisible()
  await expect(nav.getByRole('link', { name: 'LinkedIn' })).not.toBeVisible()
  await nav.getByRole('button', { name: 'Socials' }).hover()
  await expect(nav.getByRole('link', { name: 'Github' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'LinkedIn' })).toBeVisible()
})

test('clicking Projects > Summary goes to Summary page', async ({ page }) => {
  const nav = page.getByRole('navigation')
  await nav.getByRole('button', { name: 'Projects' }).hover()
  await nav.getByRole('link', { name: 'Summary' }).click()
  await expect(page).toHaveURL('/projects/summary/')
})

test('clicking Projects > AI-generated Blog goes to AI Blog page', async ({ page }) => {
  const nav = page.getByRole('navigation')
  await nav.getByRole('button', { name: 'Projects' }).hover()
  await nav.getByRole('link', { name: 'AI-generated Blog' }).click()
  await expect(page).toHaveURL('/projects/ai_blog/blog/')
})

test('clicking Projects > The Button goes to The Button page', async ({ page }) => {
  const nav = page.getByRole('navigation')
  await nav.getByRole('button', { name: 'Projects' }).hover()
  await nav.getByRole('link', { name: 'The Button' }).click()
  await expect(page).toHaveURL('/projects/the_button/')
})

test('clicking Socials > Github goes my Github profile', async ({ page }) => {
  const nav = page.getByRole('navigation')
  await nav.getByRole('button', { name: 'Socials' }).hover()
  await nav.getByRole('link', { name: 'Github' }).click()
  await expect(page).toHaveURL('https://github.com/gshively11')
})

test('clicking Socials > LinkedIn goes my LinkedIn profile', async ({ page }) => {
  const nav = page.getByRole('navigation')
  await nav.getByRole('button', { name: 'Socials' }).hover()
  // check href instead of clicking because linkedin likes to redirect to an authwall
  await expect(nav.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
    'href',
    'https://linkedin.com/in/grant-shively'
  )
})
