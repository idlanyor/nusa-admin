import { execSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import { scaffoldPage, type PageKind } from '../src/scaffold'

const demo = resolve(import.meta.dirname, '../../../apps/demo')
const out = join(demo, 'src/pages/__scaffold_test__')
afterAll(() => rmSync(out, { recursive: true, force: true }))

describe('scaffold_page output', () => {
  it('type-checks against the real kit for every page kind and several field sets', () => {
    rmSync(out, { recursive: true, force: true })
    mkdirSync(out, { recursive: true })
    const cases: [PageKind, string, string[] | undefined][] = [
      ['list', 'Customer', ['name', 'email', 'status', 'createdAt']],
      ['list', 'invoice line', ['description', 'quantity', 'price']],
      ['form', 'Customer', ['name', 'email', 'status', 'createdAt', 'notes']],
      ['form', 'Product', ['title', 'price', 'stock']],
      ['detail', 'Customer', undefined],
      ['dashboard', 'Sales', undefined],
    ]
    cases.forEach(([kind, entity, fields], i) => {
      const page = scaffoldPage(kind, entity, fields)
      writeFileSync(join(out, `Case${i}.vue`), page.code)
    })
    let output = ''
    try {
      execSync('bunx vue-tsc --noEmit -p tsconfig.json', { cwd: demo, stdio: 'pipe' })
    } catch (e) {
      output = String((e as { stdout?: Buffer }).stdout ?? e)
    }
    expect(output.split('\n').filter((l) => l.includes('__scaffold_test__'))).toEqual([])
  }, 120_000)

  it('names files and routes from the entity', () => {
    expect(scaffoldPage('list', 'company').path).toBe('src/pages/Companies.vue')
    expect(scaffoldPage('form', 'order item').path).toBe('src/pages/OrderItemForm.vue')
    expect(scaffoldPage('detail', 'Box').notes).toContain("'boxes/:id'")
  })
})
