import { expect, test } from './fixtures'
import { routes } from './routes'

for (const path of routes) {
  test(`renders ${path} without errors or horizontal overflow`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    page.on('pageerror', (e) => errors.push(e.message))

    await page.goto(path)
    await expect(page.locator('h1').first()).toBeVisible()
    await page.waitForLoadState('networkidle')

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow, 'page scrolls sideways').toBeLessThanOrEqual(0)
    expect(errors).toEqual([])
  })
}
