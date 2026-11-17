import { test as base, expect } from '@playwright/test'

export type Role = 'admin' | 'editor' | 'viewer'

/** Signs in (demo session in localStorage) before each page loads. Override with `test.use({ role: 'viewer' })`. */
export const test = base.extend<{ role: Role | null }>({
  role: ['admin', { option: true }],
  page: async ({ page, role }, use) => {
    if (role) {
      await page.addInitScript((r) => {
        if (!localStorage.getItem('nu-demo-session')) {
          localStorage.setItem('nu-demo-session', JSON.stringify({ name: 'Ayu Lestari', email: 'ayu@example.com', role: r }))
        }
      }, role)
    }
    await use(page)
  },
})
export { expect }
