import { expect, test } from './fixtures'

test.describe('desktop shell', () => {
  test.skip(({ isMobile }) => isMobile, 'desktop layout only')

  test('sidebar search filters the menu and navigates', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('searchbox', { name: 'Search menu' }).fill('kanban')
    await page.locator('.nu-menu__link--result', { hasText: 'Kanban' }).click()
    await expect(page).toHaveURL(/\/apps\/kanban$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Kanban' })).toBeVisible()
  })

  test('top-nav layout replaces the sidebar with a navbar menu', async ({ page }) => {
    await page.goto('/layout/top-nav')
    await expect(page.locator('.nu-layout__sidebar')).toBeHidden()
    const topnav = page.locator('.nu-topnav')
    await expect(topnav).toBeVisible()
    await topnav.getByRole('button', { name: 'Interface' }).click()
    await page.getByRole('menuitem', { name: 'Validation' }).click()
    await expect(page).toHaveURL(/\/forms\/validation$/)
  })

  test('layout options persist across reloads', async ({ page }) => {
    await page.goto('/layout/options')
    await page.locator('.layout-opts li', { hasText: 'Boxed' }).locator('.nu-switch__track').click()
    await expect(page.getByRole('switch', { name: 'Boxed' })).toBeChecked()
    await expect(page.locator('.nu-layout')).toHaveClass(/is-boxed/)
    await page.reload()
    await expect(page.locator('.nu-layout')).toHaveClass(/is-boxed/)
  })
})

test('dark mode uses neutral (not blue-tinted) surfaces', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Switch to dark mode' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  const [bg, card] = await page.evaluate(() => [
    getComputedStyle(document.body).backgroundColor,
    getComputedStyle(document.querySelector('.nu-card')!).backgroundColor,
  ])
  expect(bg).toBe('rgb(10, 10, 10)')
  expect(card).toBe('rgb(23, 23, 23)')
})

test('validation form reports errors and focuses the first invalid field', async ({ page }) => {
  await page.goto('/forms/validation')
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page.getByLabel('Full name')).toBeFocused()
  await expect(page.getByText('Enter a valid email address.').or(page.getByText('This field is required.')).first()).toBeVisible()
  await page.getByLabel('Full name').fill('Ayu Lestari')
  await page.getByLabel('Email').fill('not-an-email')
  await page.getByLabel('Email').blur()
  await expect(page.getByText('Enter a valid email address.')).toBeVisible()
})

test('modal traps focus and returns it to the opener', async ({ page }) => {
  await page.goto('/ui/feedback')
  const opener = page.getByRole('button', { name: 'Modal', exact: true })
  await opener.click()
  const dialog = page.getByRole('dialog', { name: 'Invite teammate' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByLabel('Email')).toBeFocused()
  for (let i = 0; i < 6; i++) await page.keyboard.press('Tab')
  expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(opener).toBeFocused()
})
