import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// The composables keep module-level state, so each test loads a fresh copy.
beforeEach(() => {
  vi.resetModules()
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.removeAttribute('style')
})
afterEach(() => vi.useRealTimers())

describe('useTheme', () => {
  const load = async () => (await import('../src/composables/useTheme')).useTheme()

  it('applies and persists the chosen mode and brand color', async () => {
    const { theme, setMode, setPrimary } = await load()
    setMode('dark')
    setPrimary('#0d9488')
    expect(theme.resolved).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.style.getPropertyValue('--nu-primary')).toBe('#0d9488')
    expect(JSON.parse(localStorage.getItem('nu-theme')!)).toEqual({ mode: 'dark', primary: '#0d9488' })
  })

  it('restores a saved preference on load', async () => {
    localStorage.setItem('nu-theme', JSON.stringify({ mode: 'dark', primary: '#e11d48' }))
    const { theme } = await load()
    expect(theme.mode).toBe('dark')
    expect(theme.primary).toBe('#e11d48')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('uses app defaults only while nothing is saved, without persisting them', async () => {
    const fresh = await load()
    fresh.setDefaults({ mode: 'dark', primary: '#2563eb' })
    expect(fresh.theme.mode).toBe('dark')
    expect(localStorage.getItem('nu-theme')).toBeNull()

    vi.resetModules()
    localStorage.setItem('nu-theme', JSON.stringify({ mode: 'light', primary: null }))
    const returning = await load()
    returning.setDefaults({ mode: 'dark', primary: '#2563eb' })
    expect(returning.theme.mode).toBe('light')
    expect(returning.theme.primary).toBeNull()
  })

  it('toggles between light and dark and survives corrupt storage', async () => {
    localStorage.setItem('nu-theme', '{not json')
    const { theme, setMode, toggleDark } = await load()
    setMode('light')
    toggleDark()
    expect(theme.resolved).toBe('dark')
    toggleDark()
    expect(theme.resolved).toBe('light')
  })
})

describe('useLayout', () => {
  const load = async () => (await import('../src/composables/useLayout')).useLayout()

  it('persists collapse and sidebar variant, but not the mobile drawer state', async () => {
    const { layout, setCollapsed, setSidebarVariant } = await load()
    setCollapsed(true)
    setSidebarVariant('light')
    expect(layout.collapsed).toBe(true)
    const saved = JSON.parse(localStorage.getItem('nu-layout')!)
    expect(saved).toMatchObject({ collapsed: true, sidebarVariant: 'light' })
    expect(saved).not.toHaveProperty('mobileOpen')
  })

  it('saves layout options and lets app defaults apply only without a saved preference', async () => {
    const fresh = await load()
    fresh.setDefaults({ boxed: true, fixedFooter: true })
    expect(fresh.layout.boxed).toBe(true)
    expect(localStorage.getItem('nu-layout')).toBeNull()
    fresh.setOption('topNav', true)
    expect(JSON.parse(localStorage.getItem('nu-layout')!)).toMatchObject({ topNav: true, boxed: true, fixedNavbar: true })

    vi.resetModules()
    const returning = await load()
    returning.setDefaults({ boxed: false })
    expect(returning.layout.topNav).toBe(true)
    expect(returning.layout.boxed).toBe(true)
  })

  it('restores saved layout and ignores unknown values', async () => {
    localStorage.setItem('nu-layout', JSON.stringify({ collapsed: true, sidebarVariant: 'neon' }))
    const { layout } = await load()
    expect(layout.collapsed).toBe(true)
    expect(layout.sidebarVariant).toBe('dark')
  })
})

describe('useToast', () => {
  const load = async () => (await import('../src/composables/useToast')).useToast()

  it('queues toasts with the right color and auto-dismisses after the duration', async () => {
    vi.useFakeTimers()
    const { toasts, success, error } = await load()
    success('Saved')
    error({ title: 'Oops', message: 'Failed', duration: 1000 })
    expect(toasts.map((t) => [t.color, t.message])).toEqual([['success', 'Saved'], ['danger', 'Failed']])
    vi.advanceTimersByTime(1000)
    expect(toasts.map((t) => t.message)).toEqual(['Saved'])
    vi.advanceTimersByTime(3000)
    expect(toasts).toHaveLength(0)
  })

  it('keeps a toast with duration 0 until dismissed', async () => {
    vi.useFakeTimers()
    const { toasts, show, dismiss } = await load()
    const id = show({ message: 'Sticky', duration: 0 })
    vi.advanceTimersByTime(60_000)
    expect(toasts).toHaveLength(1)
    dismiss(id)
    expect(toasts).toHaveLength(0)
  })
})

describe('useForm', () => {
  const load = async () => import('../src/composables/useForm')

  it('validates on submit, reports the first failing rule per field, and skips the handler', async () => {
    const { useForm, rules } = await load()
    const form = useForm({ email: '', password: '', confirm: '' }, {
      email: [rules.required(), rules.email()],
      password: [rules.required(), rules.minLength(8)],
      confirm: [rules.sameAs('password', 'No match')],
    })
    const handler = vi.fn()
    form.values.email = 'nope'
    form.values.password = 'short'
    form.values.confirm = 'x'
    await form.handleSubmit(handler)()
    expect(handler).not.toHaveBeenCalled()
    expect(form.errors).toEqual({ email: 'Enter a valid email address.', password: 'Use at least 8 characters.', confirm: 'No match' })
  })

  it('calls the handler with the values once valid and tracks submitting', async () => {
    const { useForm, rules } = await load()
    const form = useForm({ name: 'Ayu' }, { name: [rules.required()] })
    let during = false
    await form.handleSubmit(() => {
      during = form.submitting.value
    })()
    expect(during).toBe(true)
    expect(form.submitting.value).toBe(false)
  })

  it('field() validates on blur, then live, and re-checks dependent fields', async () => {
    const { useForm, rules } = await load()
    const form = useForm({ password: '', confirm: '' }, { password: [rules.required()], confirm: [rules.sameAs('password')] })
    const pw = form.field('password')
    pw['onUpdate:modelValue']('')
    expect(form.errors.password).toBeUndefined()
    pw.onBlur()
    expect(form.errors.password).toBe('This field is required.')
    pw['onUpdate:modelValue']('secret12')
    expect(form.errors.password).toBeUndefined()

    form.field('confirm').onBlur()
    expect(form.errors.confirm).toBe('The values do not match.')
    form.field('confirm')['onUpdate:modelValue']('secret12')
    expect(form.errors.confirm).toBeUndefined()
    form.field('password')['onUpdate:modelValue']('changed!')
    expect(form.errors.confirm).toBe('The values do not match.')
  })

  it('optional rules pass on empty values, and reset restores initial values', async () => {
    const { useForm, rules } = await load()
    const form = useForm({ site: '', age: '' as string | number }, { site: [rules.pattern(/^https?:/)], age: [rules.min(18)] })
    expect(form.validate()).toBe(true)
    form.values.age = 12
    expect(form.validate()).toBe(false)
    form.reset()
    expect(form.values.age).toBe('')
    expect(form.errors).toEqual({})
  })
})
