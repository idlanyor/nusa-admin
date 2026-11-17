import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import NuNumberInput from '../src/components/NuNumberInput.vue'
import NuPinInput from '../src/components/NuPinInput.vue'
import NuPopover from '../src/components/NuPopover.vue'
import NuTreeView from '../src/components/NuTreeView.vue'
import NuHeatmap from '../src/components/NuHeatmap.vue'

enableAutoUnmount(afterEach)

describe('NuNumberInput', () => {
  it('steps with buttons and arrow keys and clamps to min/max', async () => {
    const w = mount(NuNumberInput, { props: { modelValue: 9, min: 0, max: 10, step: 2 } })
    await w.find('[aria-label="Increase"]').trigger('click')
    expect(w.emitted('update:modelValue')![0]).toEqual([10])
    await w.setProps({ modelValue: 1 })
    await w.find('input').trigger('keydown', { key: 'ArrowDown' })
    expect(w.emitted('update:modelValue')![1]).toEqual([0])
  })

  it('keeps step precision and clamps typed values on blur', async () => {
    const w = mount(NuNumberInput, { props: { modelValue: 0.1, step: 0.1, max: 5 } })
    await w.find('[aria-label="Increase"]').trigger('click')
    expect(w.emitted('update:modelValue')![0]).toEqual([0.2])
    await w.setProps({ modelValue: 42 })
    await w.find('input').trigger('blur')
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([5])
  })
})

describe('NuPinInput', () => {
  it('fills from paste and emits complete', async () => {
    const w = mount(NuPinInput, { props: { modelValue: '', length: 4 }, attachTo: document.body })
    const ev = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent
    Object.defineProperty(ev, 'clipboardData', { value: { getData: () => '12-34x' } })
    w.findAll('input')[0]!.element.dispatchEvent(ev)
    await nextTick()
    expect(w.emitted('update:modelValue')![0]).toEqual(['1234'])
    expect(w.emitted('complete')).toEqual([['1234']])
  })

  it('ignores non-digits and writes typed digits at the box position', async () => {
    const w = mount(NuPinInput, { props: { modelValue: '12', length: 4 } })
    const third = w.findAll('input')[2]!
    await third.setValue('a')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    await third.setValue('7')
    expect(w.emitted('update:modelValue')![0]).toEqual(['127'])
  })
})

describe('NuTreeView', () => {
  const nodes = [
    { id: 'a', label: 'A', children: [{ id: 'a1', label: 'A1' }, { id: 'a2', label: 'A2' }] },
    { id: 'b', label: 'B' },
  ]
  const labels = (w: ReturnType<typeof mount>) => w.findAll('[role="treeitem"]').map((r) => r.text())

  it('expands with the caret or ArrowRight, collapses with ArrowLeft, selects with Enter', async () => {
    const w = mount(NuTreeView, { props: { nodes }, attachTo: document.body })
    expect(labels(w)).toEqual(['A', 'B'])
    await w.find('[role="treeitem"]').trigger('keydown', { key: 'ArrowRight' })
    expect(labels(w)).toEqual(['A', 'A1', 'A2', 'B'])
    await w.findAll('[role="treeitem"]')[2]!.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('update:modelValue')).toEqual([['a2']])
    await w.find('[role="treeitem"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(labels(w)).toEqual(['A', 'B'])
  })
})

describe('NuPopover', () => {
  it('opens on trigger click and closes on outside press and Escape', async () => {
    const w = mount(NuPopover, { attachTo: document.body, slots: { trigger: '<button id="t">Open</button>', default: '<p class="body">Hi</p>' } })
    await w.find('#t').trigger('click')
    expect(w.find('.body').exists()).toBe(true)
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await nextTick()
    expect(w.find('.body').exists()).toBe(false)
    await w.find('#t').trigger('click')
    await w.find('.nu-popover').trigger('keydown', { key: 'Escape' })
    expect(w.find('.body').exists()).toBe(false)
  })
})

describe('NuHeatmap', () => {
  it('renders weeks × 7 cells ending on the given date and totals the values', () => {
    const w = mount(NuHeatmap, { props: { values: { '2026-11-16': 5, '2026-11-10': 3, '2025-01-01': 99 }, end: '2026-11-16', weeks: 4 } })
    expect(w.findAll('.nu-heatmap__cell')).toHaveLength(28)
    expect(w.find('[role="img"]').attributes('aria-label')).toContain('8 events')
  })
})
