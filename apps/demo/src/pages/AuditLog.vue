<script setup lang="ts">
import { computed, ref } from 'vue'
import { NuAvatar, NuBadge, NuCard, NuCombobox, NuDatePicker, NuDescriptions, NuDrawer, NuHeatmap, NuPageHeader, NuTable, type NuTableColumn } from 'nusa-admin'
import { activity } from '../data'

interface Entry { id: number; at: string; actor: string; action: 'create' | 'update' | 'delete' | 'login' | 'export'; target: string; ip: string }
const actors = ['Ayu Lestari', 'Budi Santoso', 'Citra Dewi', 'Dimas Pratama', 'Eka Putri']
const acts: Entry['action'][] = ['update', 'create', 'login', 'update', 'delete', 'export', 'update', 'login']
const targets = ['Order #4821', 'Project “Website redesign”', 'User eka@example.com', 'Invoice INV-2041', 'Role “Editor”', 'Settings › Billing', 'Orders (CSV)', 'Session']
const entries: Entry[] = Array.from({ length: 64 }, (_, i) => {
  const d = new Date()
  d.setHours(d.getHours() - i * 5 - (i % 3))
  const action = acts[i % acts.length]!
  return {
    id: 5000 - i,
    at: `${d.toISOString().slice(0, 10)} ${d.toTimeString().slice(0, 5)}`,
    actor: actors[(i * 3) % actors.length]!,
    action,
    target: action === 'login' ? 'Session' : action === 'export' ? 'Orders (CSV)' : targets[i % 6]!,
    ip: `10.0.${(i * 7) % 255}.${(i * 13) % 255}`,
  }
})
const actionColor = { create: 'success', update: 'info', delete: 'danger', login: 'secondary', export: 'warning' } as const

const who = ref<(string | number)[]>([])
const kinds = ref<(string | number)[]>([])
const range = ref<[string, string] | null>(null)
const rows = computed(() =>
  entries.filter(
    (e) =>
      (!who.value.length || who.value.includes(e.actor)) &&
      (!kinds.value.length || kinds.value.includes(e.action)) &&
      (!range.value || (e.at.slice(0, 10) >= range.value[0] && e.at.slice(0, 10) <= range.value[1])),
  ),
)
const columns: NuTableColumn<Entry>[] = [
  { key: 'at', label: 'When', sortable: true, width: '150px' },
  { key: 'actor', label: 'User', sortable: true },
  { key: 'action', label: 'Action', sortable: true },
  { key: 'target', label: 'Target' },
  { key: 'ip', label: 'IP address' },
]
const open = ref<Entry | null>(null)
const heat = activity(182, 11)
</script>

<template>
  <NuPageHeader title="Audit log" subtitle="Who did what, and when." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Audit log' }]" />

  <div class="nu-stack">
    <NuCard title="Activity" subtitle="Events per day, last 26 weeks">
      <NuHeatmap :values="heat" unit="events" label="Audit events" />
    </NuCard>

    <NuCard flush>
      <template #header>
        <div class="audit-filters">
          <NuCombobox v-model="who" multiple clearable placeholder="All users" :options="actors.map((a) => ({ label: a, value: a }))" aria-label="Filter by user" />
          <NuCombobox v-model="kinds" multiple clearable placeholder="All actions" :options="Object.keys(actionColor).map((a) => ({ label: a, value: a }))" aria-label="Filter by action" />
          <NuDatePicker v-model="range" range clearable placeholder="Any date" aria-label="Filter by date" />
        </div>
      </template>
      <NuTable :columns="columns" :rows="rows" row-key="id" :page-size="10" exportable="audit-log.csv" dense>
        <template #cell-at="{ row }"><button type="button" class="audit-link nu-tabular" @click="open = row as Entry">{{ row.at }}</button></template>
        <template #cell-actor="{ row }"><span class="nu-cluster" style="flex-wrap: nowrap; --nu-gap: 6px"><NuAvatar :name="row.actor" :size="22" />{{ row.actor }}</span></template>
        <template #cell-action="{ row }"><NuBadge :color="actionColor[(row as Entry).action]">{{ row.action }}</NuBadge></template>
        <template #cell-ip="{ row }"><code>{{ row.ip }}</code></template>
      </NuTable>
    </NuCard>
  </div>

  <NuDrawer :model-value="!!open" :title="`Event #${open?.id}`" @update:model-value="!$event && (open = null)">
    <NuDescriptions
      v-if="open"
      :items="[
        { label: 'When', value: open.at },
        { label: 'User', value: open.actor },
        { label: 'Action', value: open.action },
        { label: 'Target', value: open.target },
        { label: 'IP address', value: open.ip },
        { label: 'User agent', value: 'Mozilla/5.0 (Macintosh) Chrome/131' },
      ]"
    />
    <pre v-if="open" class="code" style="margin-top: 12px">{{ JSON.stringify({ id: open.id, action: open.action, target: open.target, changes: open.action === 'update' ? { status: ['Pending', 'Paid'] } : undefined }, null, 2) }}</pre>
  </NuDrawer>
</template>

<style>
.audit-filters { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; width: 100%; }
@media (max-width: 800px) { .audit-filters { grid-template-columns: 1fr; } }
.audit-link { padding: 0; border: 0; background: none; color: var(--nu-primary); cursor: pointer; }
.audit-link:hover { text-decoration: underline; }
</style>
