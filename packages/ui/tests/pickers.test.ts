import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import NuCombobox from '../src/components/NuCombobox.vue'
import NuDatePicker from '../src/components/NuDatePicker.vue'
import NuTodoList from '../src/components/NuTodoList.vue'

enableAutoUnmount(afterEach)
const options = [
  { label: 'Bandung', value: 'bdg' },
  { label: 'Jakarta', value: 'jkt' },
  { label: 'Surabaya', value: 'sby' },
  { label: 'Denpasar', value: 'dps', disabled: true },
]

describe('NuCombobox', () => {
  it('filters by the search text and picks with the keyboard', async () => {
    const w = mount(NuCombobox, { props: { options, modelValue: null }, attachTo: document.body })
    await w.find('[role="combobox"]').trigger('click')
    const search = w.find('.nu-combo__search input')
    await search.setValue('ja')
    expect(w.findAll('[role="option"]').map((o) => o.text())).toEqual(['Jakarta'])
    await search.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('update:modelValue')).toEqual([['jkt']])
    expect(w.find('[role="listbox"]').exists()).toBe(false)
  })

  it('toggles values in multiple mode, keeps the list open and ignores disabled options', async () => {
    const w = mount(NuCombobox, { props: { options, modelValue: ['bdg'], multiple: true }, attachTo: document.body })
    await w.find('[role="combobox"]').trigger('click')
    const opts = w.findAll('[role="option"]')
    await opts[1]!.trigger('click')
    expect(w.emitted('update:modelValue')![0]).toEqual([['bdg', 'jkt']])
    await w.setProps({ modelValue: ['bdg', 'jkt'] })
    await opts[0]!.trigger('click')
    expect(w.emitted('update:modelValue')![1]).toEqual([['jkt']])
    await opts[3]!.trigger('click')
    expect(w.emitted('update:modelValue')).toHaveLength(2)
    expect(w.find('[role="listbox"]').exists()).toBe(true)
  })

  it('shows the selected label and clears it', async () => {
    const w = mount(NuCombobox, { props: { options, modelValue: 'sby', clearable: true } })
    expect(w.find('.nu-combo__value').text()).toBe('Surabaya')
    await w.find('[aria-label="Clear selection"]').trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([[null]])
  })
})

describe('NuDatePicker', () => {
  it('picks a single date and closes', async () => {
    const w = mount(NuDatePicker, { props: { modelValue: '2026-11-16' }, attachTo: document.body })
    expect(w.find('.nu-datepicker__trigger').text()).toBe('Nov 16, 2026')
    await w.find('.nu-datepicker__trigger').trigger('click')
    await w.find('[aria-label="2026-11-20"]').trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([['2026-11-20']])
    expect(w.find('[role="dialog"]').exists()).toBe(false)
  })

  it('builds a sorted range from two clicks', async () => {
    const w = mount(NuDatePicker, { props: { modelValue: ['2026-11-01', '2026-11-03'], range: true }, attachTo: document.body })
    await w.find('.nu-datepicker__trigger').trigger('click')
    expect(w.find('[aria-label="2026-11-02"]').classes()).toContain('is-in-range')
    await w.find('[aria-label="2026-11-25"]').trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    await w.find('[aria-label="2026-11-18"]').trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([[['2026-11-18', '2026-11-25']]])
  })
})

describe('NuTodoList', () => {
  const items = [
    { id: 1, text: 'One', done: false },
    { id: 2, text: 'Two', done: true },
  ]

  it('toggles, removes and adds items', async () => {
    const w = mount(NuTodoList, { props: { modelValue: items, addable: true } })
    await w.findAll('input[type="checkbox"]')[0]!.trigger('change')
    expect((w.emitted('update:modelValue')![0]![0] as typeof items)[0]!.done).toBe(true)
    await w.find('[aria-label="Delete Two"]').trigger('click')
    expect((w.emitted('update:modelValue')![1]![0] as typeof items).map((t) => t.text)).toEqual(['One'])
    await w.find('.nu-todo__input').setValue('Three')
    await w.find('form').trigger('submit')
    expect((w.emitted('update:modelValue')![2]![0] as typeof items).map((t) => t.text)).toEqual(['One', 'Three'])
    expect(w.emitted('add')).toEqual([['Three']])
  })

  it('reorders with the keyboard handle', async () => {
    const w = mount(NuTodoList, { props: { modelValue: items } })
    await w.findAll('.nu-todo__handle')[1]!.trigger('keydown', { key: 'ArrowUp' })
    expect((w.emitted('update:modelValue')![0]![0] as typeof items).map((t) => t.text)).toEqual(['Two', 'One'])
  })
})
