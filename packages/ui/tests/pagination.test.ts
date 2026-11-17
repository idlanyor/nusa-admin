import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NuPagination from '../src/components/NuPagination.vue'

const labels = (w: ReturnType<typeof mount>) => w.findAll('.nu-pagination__btn, .nu-pagination__gap').map((n) => n.text())

describe('NuPagination', () => {
  it('collapses distant pages into ellipses around the current page', () => {
    const w = mount(NuPagination, { props: { total: 200, pageSize: 10, modelValue: 10 } })
    expect(labels(w)).toEqual(['', '1', '…', '9', '10', '11', '…', '20', ''])
  })

  it('shows every page when there are only a few', () => {
    const w = mount(NuPagination, { props: { total: 30, pageSize: 10, modelValue: 1 } })
    expect(labels(w)).toEqual(['', '1', '2', '3', ''])
  })

  it('renders a single page for an empty list', () => {
    const w = mount(NuPagination, { props: { total: 0, modelValue: 1 } })
    expect(labels(w)).toEqual(['', '1', ''])
  })

  it('emits the clicked page and marks the current one', async () => {
    const w = mount(NuPagination, { props: { total: 50, pageSize: 10, modelValue: 2 } })
    expect(w.find('[aria-current="page"]').text()).toBe('2')
    await w.findAll('.nu-pagination__btn').find((b) => b.text() === '3')!.trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([[3]])
  })

  it('disables previous on the first page and next on the last', async () => {
    const w = mount(NuPagination, { props: { total: 30, pageSize: 10, modelValue: 1 } })
    expect(w.find('[aria-label="Previous page"]').attributes('disabled')).toBeDefined()
    expect(w.find('[aria-label="Next page"]').attributes('disabled')).toBeUndefined()
    await w.setProps({ modelValue: 3 })
    expect(w.find('[aria-label="Next page"]').attributes('disabled')).toBeDefined()
  })
})
