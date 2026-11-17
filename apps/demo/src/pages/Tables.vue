<script setup lang="ts">
import { Download, Plus } from 'lucide-vue-next'
import { NuAvatar, NuAvatarGroup, NuBadge, NuButton, NuCard, NuPageHeader, NuProgress, NuTable, type NuTableColumn } from 'nusa-admin'
import { orders, statusColor, usd, type Order } from '../data'

const columns: NuTableColumn<Order>[] = [
  { key: 'id', label: 'Order', sortable: true, width: '90px' },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'product', label: 'Product', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true, align: 'right', format: usd },
  { key: 'status', label: 'Status', sortable: true },
]

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
  <NuPageHeader title="Tables" subtitle="Client-side search, sorting and pagination." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Tables' }]">
    <NuButton :icon="Plus">Add order</NuButton>
  </NuPageHeader>

  <div class="nu-stack">
    <NuCard title="Orders" flush>
      <NuTable :columns="columns" :rows="orders" row-key="id" searchable search-placeholder="Search orders…" :page-size="8">
        <template #toolbar>
          <NuButton size="sm" variant="outline" color="secondary" :icon="Download">Export CSV</NuButton>
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
            <span class="nu-text-sm nu-tabular" style="width: 34px; text-align: right">{{ row.progress }}%</span>
          </div>
        </template>
      </NuTable>
    </NuCard>

    <NuCard title="Dense &amp; striped" subtitle="No pagination" flush>
      <NuTable :columns="columns.map((c) => ({ ...c, sortable: false }))" :rows="orders.slice(0, 6)" row-key="id" :page-size="0" striped dense />
    </NuCard>
  </div>
</template>
