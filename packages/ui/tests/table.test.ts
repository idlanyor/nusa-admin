import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NuTable from '../src/components/NuTable.vue'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true, format: (v: number) => `$${v}` },
]
const rows = [
  { name: 'Citra', amount: 30 },
  { name: 'Ayu', amount: 200 },
  { name: 'Budi', amount: 5 },
]
const firstColumn = (w: ReturnType<typeof mount>) => w.findAll('tbody tr').map((tr) => tr.find('td').text())
const mountTable = (props = {}) => mount(NuTable as any, { props: { columns, rows, pageSize: 0, ...props } })

describe('NuTable', () => {
  it('renders rows in the given order and applies column formatters', () => {
    const w = mountTable()
    expect(firstColumn(w)).toEqual(['Citra', 'Ayu', 'Budi'])
    expect(w.find('tbody tr').findAll('td')[1]!.text()).toBe('$30')
  })

  it('cycles a sortable column through ascending, descending and unsorted', async () => {
    const w = mountTable()
    const sort = w.findAll('.nu-table__sort')[0]!
    await sort.trigger('click')
    expect(firstColumn(w)).toEqual(['Ayu', 'Budi', 'Citra'])
    expect(w.findAll('th')[0]!.attributes('aria-sort')).toBe('ascending')
    await sort.trigger('click')
    expect(firstColumn(w)).toEqual(['Citra', 'Budi', 'Ayu'])
    await sort.trigger('click')
    expect(firstColumn(w)).toEqual(['Citra', 'Ayu', 'Budi'])
    expect(w.findAll('th')[0]!.attributes('aria-sort')).toBe('none')
  })

  it('sorts numbers numerically, not as text', async () => {
    const w = mountTable()
    await w.findAll('.nu-table__sort')[1]!.trigger('click')
    expect(firstColumn(w)).toEqual(['Budi', 'Citra', 'Ayu'])
  })

  it('filters by the search box and shows the empty text when nothing matches', async () => {
    const w = mountTable({ searchable: true, emptyText: 'Nothing here' })
    await w.find('input[type="search"]').setValue('bu')
    expect(firstColumn(w)).toEqual(['Budi'])
    await w.find('input[type="search"]').setValue('zzz')
    expect(w.find('.nu-table__empty').text()).toBe('Nothing here')
  })

  it('paginates and returns to page 1 when the search changes', async () => {
    const many = Array.from({ length: 25 }, (_, i) => ({ name: `User ${i + 1}`, amount: i }))
    const w = mountTable({ rows: many, pageSize: 10, searchable: true })
    expect(w.findAll('tbody tr')).toHaveLength(10)
    expect(w.find('.nu-table__range').text()).toBe('1–10 of 25')
    await w.find('[aria-label="Next page"]').trigger('click')
    expect(firstColumn(w)[0]).toBe('User 11')
    await w.find('input[type="search"]').setValue('User 2')
    expect(firstColumn(w)[0]).toBe('User 2')
    expect(w.find('.nu-table__range').text()).toBe('1–7 of 7')
  })

  it('renders a cell slot instead of the raw value', () => {
    const w = mount(NuTable as any, {
      props: { columns, rows, pageSize: 0 },
      slots: { 'cell-name': '<template #cell-name="{ row }"><b class="custom">{{ row.name }}!</b></template>' },
    })
    expect(w.find('.custom').text()).toBe('Citra!')
  })
})

describe('NuTable selection and server mode', () => {
  const many = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `User ${i + 1}`, amount: i }))

  it('selects rows and the whole page, and shows the bulk bar', async () => {
    const w = mount(NuTable as any, {
      props: { columns, rows: many, rowKey: 'id', pageSize: 5, selectable: true, selected: [] },
      slots: { bulk: '<button class="bulk-go">Go</button>' },
    })
    const boxes = () => w.findAll('tbody input[type="checkbox"]')
    await boxes()[1]!.setValue(true)
    expect(w.emitted('update:selected')![0]).toEqual([[2]])
    await w.setProps({ selected: [2] })
    expect(w.find('.nu-table__bulk').text()).toContain('1 selected')
    expect(w.find('.bulk-go').exists()).toBe(true)
    await w.find('thead input[type="checkbox"]').setValue(true)
    expect(w.emitted('update:selected')![1]).toEqual([[2, 1, 3, 4, 5]])
  })

  it('does not search, sort or page rows itself in manual mode, and emits the requests', async () => {
    const pageRows = many.slice(0, 5)
    const w = mount(NuTable as any, { props: { columns, rows: pageRows, rowKey: 'id', pageSize: 5, manual: true, total: 12, searchable: true } })
    expect(w.findAll('tbody tr')).toHaveLength(5)
    expect(w.find('.nu-table__range').text()).toBe('1–5 of 12')
    await w.find('input[type="search"]').setValue('zzz')
    expect(w.findAll('tbody tr')).toHaveLength(5)
    expect(w.emitted('update:search')).toEqual([['zzz']])
    await w.findAll('.nu-table__sort')[0]!.trigger('click')
    expect(w.emitted('update:sort')).toEqual([[{ key: 'name', dir: 'asc' }]])
    await w.find('[aria-label="Next page"]').trigger('click')
    expect(w.emitted('update:page')!.at(-1)).toEqual([2])
  })
})
