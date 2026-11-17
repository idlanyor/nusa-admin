import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toCsv } from '../src/utils/csv'
import { applyMask, unmask } from '../src/utils/mask'
import { filterMenu } from '../src/utils/menu'

describe('masks', () => {
  it('formats digits into the mask and drops characters that do not fit', () => {
    expect(applyMask('4111111111111111', '9999 9999 9999 9999')).toBe('4111 1111 1111 1111')
    expect(applyMask('41x1', '9999')).toBe('411')
    expect(applyMask('1225', '99/99')).toBe('12/25')
    expect(applyMask('12', '99/99')).toBe('12')
  })

  it('is stable when re-applied to its own output (literals that look like input)', () => {
    const once = applyMask('81234567890', '+62 999-9999-9999')
    expect(once).toBe('+62 812-3456-7890')
    expect(applyMask(once, '+62 999-9999-9999')).toBe(once)
    expect(unmask(once, '+62 999-9999-9999')).toBe('81234567890')
  })

  it('handles letter tokens', () => {
    expect(applyMask('d1234abc', 'aa 9999 aaa')).toBe('da') // digits are skipped until the next letter
    expect(applyMask('db1234abc', 'aa 9999 aaa')).toBe('db 1234 abc')
  })
})

describe('toCsv', () => {
  it('uses labels and formatters, quotes special characters and neutralises formulas', () => {
    const csv = toCsv(
      [
        { name: 'Ayu, L', amount: 5, note: '=SUM(A1)' },
        { name: 'Budi "B"', amount: 12, note: 'multi\nline' },
      ],
      [
        { key: 'name', label: 'Name' },
        { key: 'amount', label: 'Amount', format: (v: number) => `$${v}` },
        { key: 'note', label: 'Note' },
        { key: 'actions', label: '' },
      ],
    )
    expect(csv.split('\r\n')).toEqual(['Name,Amount,Note', `"Ayu, L",$5,'=SUM(A1)`, '"Budi ""B""",$12,"multi\nline"'])
  })
})

describe('filterMenu', () => {
  const menu = [
    { label: 'Home', to: '/' },
    { label: 'Admin', header: true },
    { label: 'Users', to: '/users', meta: { roles: ['admin'] } },
    { label: 'Settings', children: [{ label: 'Billing', to: '/billing', meta: { roles: ['admin'] } }] },
    { label: 'Public', header: true },
    { label: 'FAQ', to: '/faq' },
  ]
  const isAdminOnly = (i: { meta?: Record<string, unknown> }) => !(i.meta?.roles as string[] | undefined)?.includes('admin')

  it('removes denied items, emptied groups and headers left without items', () => {
    expect(filterMenu(menu, isAdminOnly).map((i) => i.label)).toEqual(['Home', 'Public', 'FAQ'])
  })

  it('keeps everything when allowed', () => {
    expect(filterMenu(menu, () => true)).toHaveLength(menu.length)
  })
})

describe('useLocale', () => {
  beforeEach(() => {
    vi.resetModules()
    localStorage.clear()
  })

  it('translates with params, falls back to English, and persists the choice', async () => {
    const { useLocale, t } = await import('../src/composables/useLocale')
    const i18n = useLocale()
    expect(t('range', { from: 1, to: 10, total: 42 })).toBe('1–10 of 42')
    i18n.setLocale('id')
    expect(t('range', { from: 1, to: 10, total: 42 })).toBe('1–10 dari 42')
    expect(document.documentElement.lang).toBe('id')
    expect(localStorage.getItem('nu-locale')).toBe('id')
    i18n.addMessages('ms', { close: 'Tutup' })
    i18n.setLocale('ms')
    expect(t('close')).toBe('Tutup')
    expect(t('today')).toBe('Today')
  })

  it('validation rules follow the active language', async () => {
    const { useLocale } = await import('../src/composables/useLocale')
    const { rules } = await import('../src/composables/useForm')
    useLocale().setLocale('id')
    expect(rules.required()('', {})).toBe('Kolom ini wajib diisi.')
    expect(rules.minLength(3)('ab', {})).toBe('Minimal 3 karakter.')
    expect(rules.required('Custom')('', {})).toBe('Custom')
  })
})
