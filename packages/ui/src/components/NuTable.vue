<script setup lang="ts" generic="T extends Record<string, any>">
import { t } from '../composables/useLocale'
import { computed, watch } from 'vue'
import type { NuTableColumn } from '../types'
import { downloadText, toCsv } from '../utils/csv'
import NuIcon from './NuIcon.vue'
import NuPagination from './NuPagination.vue'
import './form.css'

export interface NuTableSort {
  key: string
  dir: 'asc' | 'desc'
}

const props = withDefaults(
  defineProps<{
    /** Column definitions: key, label, sortable, align, width, format. */
    columns: NuTableColumn<T>[]
    /** Row objects (in server mode: just the current page). */
    rows: T[]
    /** Property used as the row key (required for `selectable`). Falls back to the row index. */
    rowKey?: string
    searchable?: boolean
    searchPlaceholder?: string
    /** Rows per page; 0 disables pagination. */
    pageSize?: number
    striped?: boolean
    hover?: boolean
    dense?: boolean
    emptyText?: string
    /** Checkbox column; bind the chosen row keys with `v-model:selected`. */
    selectable?: boolean
    /** "Export CSV" button. Pass a string to set the file name. Exports every filtered row, sorted. */
    exportable?: boolean | string
    /**
     * Server mode: the table doesn't search, sort or paginate `rows` itself. Bind
     * `v-model:search`, `v-model:sort` and `v-model:page`, load the page yourself and pass `total`.
     */
    manual?: boolean
    /** Total row count in server mode. */
    total?: number
    loading?: boolean
  }>(),
  { pageSize: 10, hover: true },
)

const page = defineModel<number>('page', { default: 1 })
const query = defineModel<string>('search', { default: '' })
const sort = defineModel<NuTableSort | null>('sort', { default: null })
const selected = defineModel<(string | number)[]>('selected', { default: () => [] })

const keyOf = (row: T, i: number) => (props.rowKey ? row[props.rowKey] : i)
const align = (a?: 'left' | 'center' | 'right') => (a === 'left' ? 'start' : a === 'right' ? 'end' : a)

const filtered = computed(() => {
  if (props.manual) return props.rows
  const q = query.value.trim().toLowerCase()
  if (!q) return props.rows
  return props.rows.filter((row) => props.columns.some((c) => String(row[c.key] ?? '').toLowerCase().includes(q)))
})

const sorted = computed(() => {
  if (props.manual || !sort.value) return filtered.value
  const { key, dir } = sort.value
  const sign = dir === 'asc' ? 1 : -1
  return [...filtered.value].sort((a, b) => {
    const x = a[key]
    const y = b[key]
    if (x == null) return 1
    if (y == null) return -1
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * sign
    return String(x).localeCompare(String(y), undefined, { numeric: true }) * sign
  })
})

const totalRows = computed(() => (props.manual ? (props.total ?? props.rows.length) : sorted.value.length))

const paged = computed(() => {
  if (props.manual || !props.pageSize) return sorted.value
  const start = (page.value - 1) * props.pageSize
  return sorted.value.slice(start, start + props.pageSize)
})

const rangeText = computed(() => {
  const total = totalRows.value
  if (!total) return t('results', { count: 0 })
  if (!props.pageSize) return t('results', { count: total })
  const start = (page.value - 1) * props.pageSize + 1
  return t('range', { from: start, to: Math.min(total, start + props.pageSize - 1), total })
})

// New search → back to page 1. Locally the row count changing does the same.
watch(query, () => (page.value = 1))
watch(
  () => props.rows.length,
  () => {
    if (!props.manual) page.value = 1
  },
)

function toggleSort(col: NuTableColumn<T>) {
  if (!col.sortable) return
  if (sort.value?.key !== col.key) sort.value = { key: col.key, dir: 'asc' }
  else if (sort.value.dir === 'asc') sort.value = { key: col.key, dir: 'desc' }
  else sort.value = null
  if (props.manual) page.value = 1
}

function ariaSort(col: NuTableColumn<T>) {
  if (!col.sortable) return undefined
  if (sort.value?.key !== col.key) return 'none'
  return sort.value.dir === 'asc' ? 'ascending' : 'descending'
}

function display(col: NuTableColumn<T>, row: T) {
  const value = row[col.key]
  return col.format ? col.format(value, row) : (value ?? '—')
}

/* Selection works on the rows currently shown (the page). */
const pageKeys = computed(() => paged.value.map((r, i) => keyOf(r, i)))
const allOnPage = computed(() => pageKeys.value.length > 0 && pageKeys.value.every((k) => selected.value.includes(k)))
const someOnPage = computed(() => !allOnPage.value && pageKeys.value.some((k) => selected.value.includes(k)))
function toggleRow(key: string | number, on: boolean) {
  selected.value = on ? [...selected.value, key] : selected.value.filter((k) => k !== key)
}
function togglePage(on: boolean) {
  const keys = new Set(pageKeys.value)
  selected.value = on ? [...new Set([...selected.value, ...keys])] : selected.value.filter((k) => !keys.has(k))
}
const clearSelection = () => (selected.value = [])

function exportCsv() {
  const name = typeof props.exportable === 'string' ? props.exportable : 'export.csv'
  downloadText(name.endsWith('.csv') ? name : `${name}.csv`, toCsv(sorted.value, props.columns))
}
</script>

<template>
  <div
    class="nu-table"
    :class="{ 'nu-table--striped': striped, 'nu-table--hover': hover, 'nu-table--dense': dense, 'is-loading': loading }"
    :aria-busy="loading || undefined"
  >
    <div v-if="selectable && selected.length && $slots.bulk" class="nu-table__bulk" role="region" :aria-label="t('bulkActions')">
      <strong>{{ t('selectedCount', { count: selected.length }) }}</strong>
      <div class="nu-table__bulk-actions"><slot name="bulk" :selected="selected" :clear="clearSelection" /></div>
      <button class="nu-table__bulk-clear" type="button" @click="clearSelection">{{ t('clear') }}</button>
    </div>
    <div v-else-if="searchable || exportable || $slots.toolbar" class="nu-table__toolbar">
      <div v-if="searchable" class="nu-control nu-control--sm nu-table__search">
        <span class="nu-control__affix"><NuIcon name="search" :size="15" /></span>
        <input v-model="query" class="nu-control__input" type="search" :placeholder="searchPlaceholder ?? t('search')" :aria-label="searchPlaceholder ?? t('search')" />
      </div>
      <div class="nu-table__toolbar-end">
        <slot name="toolbar" />
        <button v-if="exportable" class="nu-btn nu-btn--outline nu-btn--sm nu-c-secondary" type="button" :disabled="!totalRows" @click="exportCsv">
          <NuIcon name="download" :size="14" /> {{ t('exportCsv') }}
        </button>
      </div>
    </div>

    <div class="nu-table__scroll">
      <table>
        <thead>
          <tr>
            <th v-if="selectable" class="nu-table__check">
              <label class="nu-check">
                <input
                  class="nu-check__input"
                  type="checkbox"
                  :checked="allOnPage"
                  :indeterminate="someOnPage"
                  :aria-label="t('selectAll')"
                  @change="togglePage(($event.target as HTMLInputElement).checked)"
                />
                <span class="nu-check__box"><NuIcon :name="someOnPage ? 'minus' : 'check'" :size="12" /></span>
              </label>
            </th>
            <th v-for="col in columns" :key="col.key" :style="{ width: col.width, textAlign: align(col.align) }" :aria-sort="ariaSort(col)">
              <button v-if="col.sortable" class="nu-table__sort" type="button" @click="toggleSort(col)">
                {{ col.label }}
                <NuIcon
                  :name="sort?.key !== col.key ? 'sort' : sort.dir === 'asc' ? 'arrow-up' : 'arrow-down'"
                  :size="13"
                  :class="{ 'is-idle': sort?.key !== col.key }"
                />
              </button>
              <template v-else>{{ col.label }}</template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in paged" :key="keyOf(row, i)" :class="{ 'is-selected': selectable && selected.includes(keyOf(row, i)) }">
            <td v-if="selectable" class="nu-table__check">
              <label class="nu-check">
                <input
                  class="nu-check__input"
                  type="checkbox"
                  :checked="selected.includes(keyOf(row, i))"
                  :aria-label="t('selectRow', { n: i + 1 })"
                  @change="toggleRow(keyOf(row, i), ($event.target as HTMLInputElement).checked)"
                />
                <span class="nu-check__box"><NuIcon name="check" :size="12" /></span>
              </label>
            </td>
            <td v-for="col in columns" :key="col.key" :style="{ textAlign: align(col.align) }">
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">{{ display(col, row) }}</slot>
            </td>
          </tr>
          <tr v-if="!paged.length">
            <td class="nu-table__empty" :colspan="columns.length + (selectable ? 1 : 0)">
              <slot name="empty">{{ loading ? t('tableLoading') : (emptyText ?? t('tableEmpty')) }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="pageSize" class="nu-table__footer">
      <span class="nu-table__range">{{ rangeText }}</span>
      <NuPagination v-model="page" :total="totalRows" :page-size="pageSize" />
    </div>
  </div>
</template>

<style>
.nu-table { min-width: 0; }
.nu-table__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 8px 14px;
  border-bottom: 1px solid var(--nu-border);
}
.nu-table__search { width: 260px; max-width: 100%; }
.nu-table__toolbar-end { display: flex; align-items: center; gap: 8px; margin-inline-start: auto; }
.nu-table__scroll { overflow-x: auto; }
.nu-table table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.nu-table th {
  padding: 7px 14px;
  border-bottom: 1px solid var(--nu-border);
  background: var(--nu-surface-2);
  color: var(--nu-text-muted);
  font-size: 12px;
  font-weight: 600;
  text-align: start;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.nu-table td { padding: 8px 14px; white-space: nowrap; border-bottom: 1px solid var(--nu-border); vertical-align: middle; }
.nu-table tbody tr:last-child td { border-bottom: 0; }
.nu-table--dense td { padding: 4px 14px; }
.nu-table--striped tbody tr:nth-child(even) td { background: color-mix(in srgb, var(--nu-surface-2) 70%, transparent); }
.nu-table--hover tbody tr:hover td { background: color-mix(in srgb, var(--nu-primary) 5%, transparent); }
.nu-table__sort {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-transform: inherit;
  letter-spacing: inherit;
  cursor: pointer;
}
.nu-table__sort:hover { color: var(--nu-text); }
.nu-table__sort .is-idle { opacity: 0.45; }
.nu-table td .nu-cluster { flex-wrap: nowrap; }
.nu-table { position: relative; }
.nu-table.is-loading tbody { opacity: 0.45; transition: opacity 0.15s ease; }
.nu-table.is-loading::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--nu-primary), transparent);
  background-size: 50% 100%;
  background-repeat: no-repeat;
  animation: nu-table-loading 1s linear infinite;
}
@keyframes nu-table-loading { from { background-position: -50% 0; } to { background-position: 150% 0; } }
.nu-table__check { width: 40px; padding-inline-end: 0 !important; }
.nu-table tbody tr.is-selected td { background: color-mix(in srgb, var(--nu-primary) 8%, transparent); }
.nu-check__input:indeterminate + .nu-check__box { border-color: var(--nu-primary); background: var(--nu-primary); color: var(--nu-on-color); }
.nu-table__bulk {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 8px 14px;
  border-bottom: 1px solid var(--nu-border);
  background: color-mix(in srgb, var(--nu-primary) 8%, var(--nu-surface));
}
.nu-table__bulk-actions { display: flex; flex-wrap: wrap; gap: 6px; }
.nu-table__bulk-clear { margin-inline-start: auto; padding: 4px 8px; border: 0; border-radius: var(--nu-radius-sm); background: transparent; color: var(--nu-text-muted); font-weight: 600; cursor: pointer; }
.nu-table__bulk-clear:hover { color: var(--nu-text); }
.nu-table__empty { padding: 24px 14px !important; text-align: center; color: var(--nu-text-muted); }
.nu-table__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 8px 14px;
  border-top: 1px solid var(--nu-border);
}
.nu-table__range { font-size: 13px; color: var(--nu-text-muted); font-variant-numeric: tabular-nums; }
</style>
