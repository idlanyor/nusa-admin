import { expect, test } from './fixtures'

test.describe('signed out', () => {
  test.use({ role: null })

  test('protected pages redirect to sign-in and come back after login', async ({ page }) => {
    await page.goto('/projects/2')
    await expect(page).toHaveURL(/\/auth\/login\?redirect=(\/|%2F)projects(\/|%2F)2$/)
    await page.getByRole('radio', { name: 'Editor' }).click()
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()
    await expect(page).toHaveURL(/\/projects\/2$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Mobile banking app' })).toBeVisible()
  })
})

test.describe('viewer role', () => {
  test.use({ role: 'viewer' })

  test('admin-only pages are hidden from the menu and blocked by the router', async ({ page, isMobile }) => {
    test.skip(isMobile, 'menu is in the drawer on mobile')
    await page.goto('/')
    await expect(page.locator('.nu-sidebar').getByRole('link', { name: 'Projects' })).toBeVisible()
    await expect(page.locator('.nu-sidebar').getByRole('link', { name: 'Users' })).toHaveCount(0)
    await page.goto('/users')
    await expect(page).toHaveURL(/\/errors\/403/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText("don't have access")
  })
})

test('command palette opens with Ctrl+K and navigates', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.keyboard.press('Control+k')
  const dialog = page.getByRole('dialog', { name: 'Command palette' })
  await expect(dialog.getByRole('combobox')).toBeFocused()
  await page.keyboard.type('editable')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/tables\/editable$/)
  await expect(dialog).toBeHidden()
})

test('command palette falls back to full-text search', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible() // shell (and its hotkey) loaded
  await page.keyboard.press('Control+k')
  await expect(page.getByRole('combobox')).toBeFocused()
  await page.keyboard.type('sinar')
  await page.getByRole('option', { name: /Search everything for “sinar”/ }).click()
  await expect(page).toHaveURL(/\/search\?q=sinar$/)
  await expect(page.getByRole('link', { name: 'Website redesign' })).toBeVisible()
})

test('switching to Indonesian translates the kit chrome and validation', async ({ page, isMobile }) => {
  test.skip(isMobile, 'language menu is in the navbar')
  await page.goto('/forms/validation')
  await page.getByRole('button', { name: 'Language' }).click()
  await page.getByRole('menuitem', { name: 'Bahasa Indonesia' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'id')
  await expect(page.getByRole('searchbox', { name: 'Cari menu' })).toBeVisible()
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page.getByText('Kolom ini wajib diisi.').first()).toBeVisible()
})

test('RTL example mirrors the layout', async ({ page, isMobile }) => {
  test.skip(isMobile, 'checks the desktop sidebar position')
  await page.goto('/layout/rtl')
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  const box = await page.locator('.nu-layout__sidebar').boundingBox()
  const width = page.viewportSize()!.width
  expect(box!.x + box!.width).toBeGreaterThan(width - 2)
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
})

test('tables: select rows, bulk action bar, and CSV export', async ({ page }) => {
  await page.goto('/tables/data')
  const table = page.locator('.nu-table').first()
  await table.locator('tbody tr').nth(0).locator('.nu-check__box').click()
  await table.locator('tbody tr').nth(1).locator('.nu-check__box').click()
  await expect(table.getByRole('region', { name: 'Bulk actions' })).toContainText('2 selected')
  await table.getByRole('button', { name: 'Clear' }).click()
  const download = page.waitForEvent('download')
  await table.getByRole('button', { name: 'Export CSV' }).click()
  const file = await download
  expect(file.suggestedFilename()).toBe('orders.csv')
})

test('input masks format as you type', async ({ page }) => {
  await page.goto('/forms/advanced')
  const card = page.getByLabel('Card number')
  await card.pressSequentially('4111x1111111111119999')
  await expect(card).toHaveValue('4111 1111 1111 1111')
  const phone = page.getByLabel('Phone')
  await phone.pressSequentially('81234567890')
  await expect(phone).toHaveValue('+62 812-3456-7890')
})

test('support ticket: reply as staff marks it answered', async ({ page }) => {
  await page.goto('/support/tickets/1038')
  await page.getByRole('textbox', { name: 'Reply' }).fill('Thanks Eka, we can reproduce it on Safari and are fixing it.')
  await page.getByRole('button', { name: /^Send/ }).click()
  await expect(page.locator('.thread li').last()).toContainText('we can reproduce it on Safari')
  await expect(page.locator('.nu-page-header')).toContainText('Answered')
})

test('API token revoke asks for typed confirmation', async ({ page }) => {
  await page.goto('/account/api-tokens')
  await page.getByRole('button', { name: 'Revoke Old script' }).click()
  const dialog = page.getByRole('dialog', { name: 'Revoke “Old script”?' })
  const revoke = dialog.getByRole('button', { name: 'Revoke token' })
  await expect(revoke).toBeDisabled()
  await dialog.getByRole('textbox').fill('Old script')
  await revoke.click()
  await expect(dialog).toBeHidden()
  await expect(page.getByText('Old script', { exact: true })).toHaveCount(0)
})

test.describe('mobile bottom nav', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile only')

  test('tabs navigate and the menu sheet reaches every page', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Main' }).filter({ has: page.locator('.nu-bottomnav__tab') })
    await nav.getByRole('link', { name: 'Support tickets' }).click()
    await expect(page).toHaveURL(/\/support\/tickets$/)
    await nav.getByRole('button', { name: 'Menu' }).click()
    const sheet = page.getByRole('dialog', { name: 'Menu' })
    await sheet.getByRole('link', { name: 'Server monitor' }).click()
    await expect(page).toHaveURL(/\/monitoring$/)
    await expect(sheet).toBeHidden()
  })
})
