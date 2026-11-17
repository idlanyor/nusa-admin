<script setup lang="ts">
import { ref, watch } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { NuAvatar, NuAvatarGroup, NuBadge, NuButton, NuCard, NuPageHeader, NuProgress, NuTable, useToast, type NuTableColumn, type NuTableSort } from 'nusa-admin'
import { orders, statusColor, usd, type Order } from '../data'

const columns: NuTableColumn<Order>[] = [
  { key: 'id', label: 'Order', sortable: true, width: '90px' },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'product', label: 'Product', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true, align: 'right', format: usd },
  { key: 'status', label: 'Status', sortable: true },
]

const toast = useToast()
const selected = ref<(string | number)[]>([])

/* Server-side example: a fake API that searches, sorts and pages on "the server". */
const remote = ref<Order[]>([])
const remoteTotal = ref(0)
const remoteLoading = ref(false)
const remotePage = ref(1)
const remoteSearch = ref('')
const remoteSort = ref<NuTableSort | null>({ key: 'date', dir: 'desc' })
const PAGE = 6
let timer: ReturnType<typeof setTimeout> | undefined
async function fakeApi(q: { page: number; search: string; sort: NuTableSort | null }) {
  await new Promise((r) => setTimeout(r, 450))
  let list = orders.filter((o) => !q.search || `${o.customer} ${o.product} ${o.id}`.toLowerCase().includes(q.search.toLowerCase()))
  if (q.sort) {
    const { key, dir } = q.sort
    list = [...list].sort((a, b) => String(a[key as keyof Order]).localeCompare(String(b[key as keyof Order]), undefined, { numeric: true }) * (dir === 'asc' ? 1 : -1))
  }
  return { rows: list.slice((q.page - 1) * PAGE, q.page * PAGE), total: list.length }
}
async function load() {
  remoteLoading.value = true
  const res = await fakeApi({ page: remotePage.value, search: remoteSearch.value, sort: remoteSort.value })
  remote.value = res.rows
  remoteTotal.value = res.total
  remoteLoading.value = false
}
watch([remotePage, remoteSort], load, { immediate: true })
watch(remoteSearch, () => {
  clearTimeout(timer)
  timer = setTimeout(load, 300)
})

const projects = [
  { name: 'Website redesign', budget: 12500, status: 'In progress', progress: 60, team: ['Ayu Lestari', 'Budi Santoso', 'Citra Dewi'] },
  { name: 'Mobile app', budget: 48000, status: 'In progress', progress: 35, team: ['Dimas Pratama', 'Eka Putri'] },
  { name: 'Billing migration', budget: 9200, status: 'Done', progress: 100, team: ['Fajar Nugroho', 'Gita Maharani', 'Hendra Wijaya', 'Indah Permata', 'Joko Susilo'] },
  { name: 'Analytics dashboard', budget: 21000, status: 'On hold', progress: 15, team: ['Kartika Sari'] },
  { name: 'Help center', budget: 6400, status: 'In progress', progress: 82, team: ['Lukman Hakim', 'Maya Anggraini'] },
]
const projectColumns: NuTableColumn[] = [
  { key: 'name', label: 'Project', sortable: true },
  { key: 'team', label: 'Team' },
  { key: 'budget', label: 'Budget', sortable: true, align: 'right', format: usd },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'progress', label: 'Completion', sortable: true, width: '200px' },
]
const projectColor = { 'In progress': 'info', Done: 'success', 'On hold': 'warning' } as const
</script>

<template>
  <NuPageHeader title="Tables" subtitle="Selection with bulk actions, CSV export, and server-side mode." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Tables' }]">
    <NuButton :icon="Plus">Add order</NuButton>
  </NuPageHeader>

  <div class="nu-stack">
    <NuCard title="Orders" flush>
      <NuTable
        v-model:selected="selected"
        :columns="columns"
        :rows="orders"
        row-key="id"
        searchable
        search-placeholder="Search orders…"
        :page-size="8"
        selectable
        exportable="orders.csv"
      >
        <template #bulk="{ selected: keys, clear }">
          <NuButton size="sm" variant="soft" @click="toast.info(`Marked ${keys.length} orders as shipped (demo).`); clear()">Mark shipped</NuButton>
          <NuButton size="sm" variant="soft" color="danger" :icon="Trash2" @click="toast.error(`Deleted ${keys.length} orders (demo).`); clear()">Delete</NuButton>
        </template>
        <template #cell-customer="{ row }">
          <div class="nu-cluster">
            <NuAvatar :name="row.customer" :size="30" />
            <div>
              <div class="nu-fw-600">{{ row.customer }}</div>
              <div class="nu-text-sm nu-text-muted">{{ row.email }}</div>
            </div>
          </div>
        </template>
        <template #cell-status="{ row }">
          <NuBadge :color="statusColor[row.status as Order['status']]" dot>{{ row.status }}</NuBadge>
        </template>
      </NuTable>
    </NuCard>

    <NuCard title="Server-side data" subtitle="manual mode: the (fake) API searches, sorts and pages; 450 ms latency" flush>
      <NuTable
        v-model:page="remotePage"
        v-model:search="remoteSearch"
        v-model:sort="remoteSort"
        :columns="columns.filter((c) => c.key !== 'customer')"
        :rows="remote"
        :total="remoteTotal"
        :loading="remoteLoading"
        :page-size="PAGE"
        row-key="id"
        manual
        searchable
        search-placeholder="Search on the server…"
      >
        <template #cell-status="{ row }">
          <NuBadge :color="statusColor[row.status as Order['status']]" dot>{{ row.status }}</NuBadge>
        </template>
      </NuTable>
    </NuCard>

    <NuCard title="Projects" subtitle="Custom cells: avatar group and progress" flush>
      <NuTable :columns="projectColumns" :rows="projects" row-key="name" :page-size="0">
        <template #cell-name="{ row }"><span class="nu-fw-600">{{ row.name }}</span></template>
        <template #cell-team="{ row }"><NuAvatarGroup :names="row.team" :size="26" :max="3" /></template>
        <template #cell-status="{ row }">
          <NuBadge :color="projectColor[row.status as keyof typeof projectColor]" dot>{{ row.status }}</NuBadge>
        </template>
        <template #cell-progress="{ row }">
          <div class="nu-cluster" style="flex-wrap: nowrap">
            <NuProgress class="nu-grow" :value="row.progress" :height="5" :color="row.progress === 100 ? 'success' : 'primary'" :label="`${row.name} completion`" label-hidden />
            <span class="nu-text-sm nu-tabular" style="width: 34px; text-align: end">{{ row.progress }}%</span>
          </div>
        </template>
      </NuTable>
    </NuCard>

    <NuCard title="Dense &amp; striped" subtitle="No pagination" flush>
      <NuTable :columns="columns.map((c) => ({ ...c, sortable: false }))" :rows="orders.slice(0, 6)" row-key="id" :page-size="0" striped dense />
    </NuCard>
  </div>
</template>
