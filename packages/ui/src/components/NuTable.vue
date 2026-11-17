<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, watch } from 'vue'
import type { NuTableColumn } from '../types'
import NuIcon from './NuIcon.vue'
import NuPagination from './NuPagination.vue'
import './form.css'

const props = withDefaults(
  defineProps<{
    columns: NuTableColumn<T>[]
    rows: T[]
    /** Property used as the row key. Falls back to the row index. */
    rowKey?: string
    searchable?: boolean
    searchPlaceholder?: string
    /** Rows per page; 0 disables pagination. */
    pageSize?: number
    striped?: boolean
    hover?: boolean
    dense?: boolean
    emptyText?: string
  }>(),
  { pageSize: 10, hover: true, searchPlaceholder: 'Search…', emptyText: 'No data to show' },
)

const query = ref('')
const page = ref(1)
const sortKey = ref<string | null>(null)
const sortDir = ref<'asc' | 'desc'>('asc')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.rows
  return props.rows.filter((row) =>
    props.columns.some((c) => String(row[c.key] ?? '').toLowerCase().includes(q)),
  )
})

const sorted = computed(() => {
  const key = sortKey.value
  if (!key) return filtered.value
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...filtered.value].sort((a, b) => {
    const x = a[key]
    const y = b[key]
    if (x == null) return 1
    if (y == null) return -1
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * dir
    return String(x).localeCompare(String(y), undefined, { numeric: true }) * dir
  })
})

const paged = computed(() => {
  if (!props.pageSize) return sorted.value
  const start = (page.value - 1) * props.pageSize
  return sorted.value.slice(start, start + props.pageSize)
})

const rangeText = computed(() => {
  const total = sorted.value.length
  if (!total) return '0 results'
  if (!props.pageSize) return `${total} results`
  const start = (page.value - 1) * props.pageSize + 1
  return `${start}–${Math.min(total, start + props.pageSize - 1)} of ${total}`
})

watch([query, () => props.rows.length], () => (page.value = 1))

function toggleSort(col: NuTableColumn<T>) {
  if (!col.sortable) return
  if (sortKey.value !== col.key) {
    sortKey.value = col.key
    sortDir.value = 'asc'
  } else if (sortDir.value === 'asc') sortDir.value = 'desc'
  else sortKey.value = null
}

function ariaSort(col: NuTableColumn<T>) {
  if (!col.sortable) return undefined
  if (sortKey.value !== col.key) return 'none'
  return sortDir.value === 'asc' ? 'ascending' : 'descending'
}

function display(col: NuTableColumn<T>, row: T) {
  const value = row[col.key]
  return col.format ? col.format(value, row) : (value ?? '—')
}
</script>

<template>
  <div class="nu-table" :class="{ 'nu-table--striped': striped, 'nu-table--hover': hover, 'nu-table--dense': dense }">
    <div v-if="searchable || $slots.toolbar" class="nu-table__toolbar">
      <div v-if="searchable" class="nu-control nu-control--sm nu-table__search">
        <span class="nu-control__affix"><NuIcon name="search" :size="15" /></span>
        <input v-model="query" class="nu-control__input" type="search" :placeholder="searchPlaceholder" :aria-label="searchPlaceholder" />
      </div>
      <div class="nu-table__toolbar-end"><slot name="toolbar" /></div>
    </div>

    <div class="nu-table__scroll">
      <table>
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              :style="{ width: col.width, textAlign: col.align }"
              :aria-sort="ariaSort(col)"
            >
              <button v-if="col.sortable" class="nu-table__sort" type="button" @click="toggleSort(col)">
                {{ col.label }}
                <NuIcon
                  :name="sortKey !== col.key ? 'sort' : sortDir === 'asc' ? 'arrow-up' : 'arrow-down'"
                  :size="13"
                  :class="{ 'is-idle': sortKey !== col.key }"
                />
              </button>
              <template v-else>{{ col.label }}</template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in paged" :key="rowKey ? row[rowKey] : i">
            <td v-for="col in columns" :key="col.key" :style="{ textAlign: col.align }">
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">{{ display(col, row) }}</slot>
            </td>
          </tr>
          <tr v-if="!paged.length">
            <td class="nu-table__empty" :colspan="columns.length"><slot name="empty">{{ emptyText }}</slot></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="pageSize" class="nu-table__footer">
      <span class="nu-table__range">{{ rangeText }}</span>
      <NuPagination v-model="page" :total="sorted.length" :page-size="pageSize" />
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
.nu-table__toolbar-end { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.nu-table__scroll { overflow-x: auto; }
.nu-table table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.nu-table th {
  padding: 7px 14px;
  border-bottom: 1px solid var(--nu-border);
  background: var(--nu-surface-2);
  color: var(--nu-text-muted);
  font-size: 12px;
  font-weight: 600;
  text-align: left;
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
