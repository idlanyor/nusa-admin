import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import NuBanner from '../src/components/NuBanner.vue'
import NuBottomNav from '../src/components/NuBottomNav.vue'
import NuConfirmHost from '../src/components/NuConfirmHost.vue'
import NuGauge from '../src/components/NuGauge.vue'
import NuLogViewer from '../src/components/NuLogViewer.vue'
import NuSecretField from '../src/components/NuSecretField.vue'
import { useConfirm } from '../src/composables/useConfirm'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
  document.body.removeAttribute('style')
})
const settle = async () => {
  await nextTick()
  await nextTick()
}

describe('useConfirm + NuConfirmHost', () => {
  it('resolves true on confirm and false on cancel, and queues calls', async () => {
    mount(NuConfirmHost, { attachTo: document.body })
    const { confirm } = useConfirm()
    const first = confirm({ title: 'Delete A?', danger: true })
    const second = confirm('Delete B?')
    await settle()
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain('Delete A?')
    document.querySelector<HTMLButtonElement>('button[type="submit"]')!.click()
    expect(await first).toBe(true)
    await settle()
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain('Delete B?')
    ;[...document.querySelectorAll<HTMLButtonElement>('.nu-modal__footer button')].find((b) => b.textContent?.includes('Cancel'))!.click()
    expect(await second).toBe(false)
  })

  it('blocks confirmation until the typed text matches', async () => {
    mount(NuConfirmHost, { attachTo: document.body })
    const result = useConfirm().confirm({ title: 'Revoke?', typeToConfirm: 'prod-key' })
    await settle()
    const submit = document.querySelector<HTMLButtonElement>('button[type="submit"]')!
    expect(submit.disabled).toBe(true)
    const input = document.querySelector<HTMLInputElement>('.nu-modal input')!
    input.value = 'prod-key'
    input.dispatchEvent(new Event('input'))
    await settle()
    expect(submit.disabled).toBe(false)
    submit.click()
    expect(await result).toBe(true)
  })
})

describe('NuSecretField', () => {
  beforeEach(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn().mockResolvedValue(undefined) }, configurable: true }))

  it('masks by default, reveals, and copies the real value', async () => {
    const w = mount(NuSecretField, { props: { value: 'nu_live_secret', label: 'Token' } })
    expect(w.find('code').text()).not.toContain('nu_live')
    await w.find('[aria-label="Show"]').trigger('click')
    expect(w.find('code').text()).toBe('nu_live_secret')
    await w.find('[aria-label="Copy"]').trigger('click')
    await settle()
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('nu_live_secret')
    expect(w.emitted('copy')).toHaveLength(1)
  })
})

describe('NuLogViewer', () => {
  it('detects levels from text and filters lines', async () => {
    const w = mount(NuLogViewer, { props: { lines: ['INFO started', 'ERROR boom', 'WARN slow', { text: 'custom', level: 'success' }] } })
    const classes = w.findAll('.nu-log__line').map((l) => l.classes().find((c) => c.startsWith('is-')))
    expect(classes).toEqual(['is-info', 'is-error', 'is-warn', 'is-success'])
    await w.find('input').setValue('boom')
    expect(w.findAll('.nu-log__line').map((l) => l.text())).toEqual(['ERROR boom'])
    expect(w.find('.nu-log__count').text()).toBe('1/4')
  })
})

describe('NuGauge', () => {
  it('shows the percentage and switches color at thresholds', () => {
    const color = (value: number) => mount(NuGauge, { props: { value } }).find('.nu-gauge__bar').attributes('stroke')
    expect(color(40)).toBe('var(--nu-primary)')
    expect(color(75)).toBe('var(--nu-warning)')
    expect(color(95)).toBe('var(--nu-danger)')
    expect(mount(NuGauge, { props: { value: 6, max: 16, unit: ' GB' } }).find('.nu-gauge__value').text()).toBe('6 GB')
  })
})

describe('NuBanner', () => {
  beforeEach(() => localStorage.clear())
  it('stays dismissed by id', async () => {
    const w = mount(NuBanner, { props: { id: 'promo', dismissible: true }, slots: { default: 'Hello' } })
    await w.find('[aria-label="Dismiss"]').trigger('click')
    expect(w.find('.nu-banner').exists()).toBe(false)
    expect(mount(NuBanner, { props: { id: 'promo', dismissible: true }, slots: { default: 'Hello' } }).find('.nu-banner').exists()).toBe(false)
    expect(mount(NuBanner, { props: { id: 'other' }, slots: { default: 'Hi' } }).find('.nu-banner').exists()).toBe(true)
  })
})

describe('NuBottomNav', () => {
  it('shows the chosen tabs, marks the active one, and groups the sheet by menu sections', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: ['/', '/a', '/b', '/c', '/d'].map((path) => ({ path, component: { template: '<div />' } })) })
    router.push('/b')
    await router.isReady()
    const menu = [
      { label: 'Home', to: '/' },
      { label: 'Apps', header: true },
      { label: 'A', to: '/a' },
      { label: 'Group', children: [{ label: 'B', to: '/b' }, { label: 'C', to: '/c' }] },
      { label: 'D', to: '/d' },
    ]
    const w = mount(NuBottomNav, { props: { menu, primary: ['/', '/b'] }, global: { plugins: [router] }, attachTo: document.body })
    const tabs = w.findAll('.nu-bottomnav__tab')
    expect(tabs.map((t) => t.text())).toEqual(['Home', 'B', 'Menu'])
    expect(tabs[1]!.attributes('aria-current')).toBe('page')
    await tabs[2]!.trigger('click')
    await settle()
    const titles = [...document.querySelectorAll('.nu-sheet__body h4')].map((h) => h.textContent)
    expect(titles).toEqual(['Apps', 'Group'])
  })
})
