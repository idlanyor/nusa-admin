<script setup lang="ts">
import { computed, ref } from 'vue'
import { Copy, Pencil, Plus, Shuffle, Trash2 } from 'lucide-vue-next'
import {
  NuBadge, NuButton, NuCard, NuDatePicker, NuDrawer, NuInput, NuNumberInput, NuPageHeader, NuProgress, NuSegmented, NuSwitch, NuTable, rules, useConfirm, useForm,
  useToast, type NuTableColumn,
} from 'nusa-admin'

interface Coupon { id: number; code: string; type: 'percent' | 'fixed'; value: number; uses: number; limit: number | null; dates: [string, string] | null; active: boolean; newOnly: boolean }
const toast = useToast()
const { confirm } = useConfirm()
const coupons = ref<Coupon[]>([
  { id: 1, code: 'WELCOME20', type: 'percent', value: 20, uses: 182, limit: null, dates: null, active: true, newOnly: true },
  { id: 2, code: 'BLACKFRIDAY', type: 'percent', value: 40, uses: 412, limit: 500, dates: ['2026-11-27', '2026-11-30'], active: true, newOnly: false },
  { id: 3, code: 'FLAT50K', type: 'fixed', value: 50000, uses: 75, limit: 100, dates: ['2026-10-01', '2026-10-31'], active: false, newOnly: false },
  { id: 4, code: 'PARTNER10', type: 'percent', value: 10, uses: 9, limit: 50, dates: null, active: true, newOnly: false },
])
const today = new Date().toISOString().slice(0, 10)
const stateOf = (c: Coupon) => (!c.active ? 'Disabled' : c.dates && c.dates[1] < today ? 'Expired' : c.dates && c.dates[0] > today ? 'Scheduled' : c.limit !== null && c.uses >= c.limit ? 'Used up' : 'Active')
const stateColor: Record<string, 'success' | 'secondary' | 'warning' | 'info' | 'danger'> = { Active: 'success', Disabled: 'secondary', Expired: 'danger', Scheduled: 'info', 'Used up': 'warning' }
const filter = ref('all')
const rows = computed(() => coupons.value.filter((c) => filter.value === 'all' || stateOf(c) === filter.value))
const value = (c: Coupon) => (c.type === 'percent' ? `${c.value}% off` : `Rp${c.value.toLocaleString('id-ID')} off`)
const columns: NuTableColumn<Coupon>[] = [
  { key: 'code', label: 'Code', sortable: true },
  { key: 'value', label: 'Discount' },
  { key: 'uses', label: 'Usage', width: '180px', sortable: true },
  { key: 'dates', label: 'Valid', format: (d) => (d ? `${d[0]} → ${d[1]}` : 'Always') },
  { key: 'active', label: 'Status' },
  { key: 'actions', label: '', align: 'right', width: '120px' },
]

const editing = ref<Coupon | null>(null)
const drawer = ref(false)
const blank = () => ({ code: '', type: 'percent' as Coupon['type'], value: 10 as number | null, limit: null as number | null, dates: null as [string, string] | null, active: true, newOnly: false })
const form = useForm(blank(), {
  code: [rules.required(), rules.pattern(/^[A-Z0-9_-]{3,20}$/, '3–20 capital letters, digits, - or _.'), (v) => coupons.value.some((c) => c.code === v && c.id !== editing.value?.id) ? 'That code already exists.' : true],
  value: [rules.required(), rules.min(1), (v, all) => (all.type === 'percent' && v > 100 ? 'At most 100%.' : true)],
})
function open(c?: Coupon) {
  editing.value = c ?? null
  form.reset(c ? { code: c.code, type: c.type, value: c.value, limit: c.limit, dates: c.dates, active: c.active, newOnly: c.newOnly } : blank())
  drawer.value = true
}
function generate() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  form.values.code = Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => chars[b % chars.length]).join('')
}
const save = form.handleSubmit((v) => {
  const data = { ...v, value: v.value!, code: v.code.toUpperCase() }
  if (editing.value) Object.assign(editing.value, data)
  else coupons.value.unshift({ id: Date.now(), uses: 0, ...data })
  drawer.value = false
  toast.success(`${data.code} saved.`)
})
async function remove(c: Coupon) {
  if (await confirm({ title: `Delete ${c.code}?`, message: c.uses ? `It was used ${c.uses} times; past orders keep their discount.` : undefined, danger: true, confirmLabel: 'Delete' })) {
    coupons.value = coupons.value.filter((x) => x.id !== c.id)
  }
}
async function copy(code: string) {
  await navigator.clipboard?.writeText(code).catch(() => {})
  toast.success(`${code} copied.`)
}
</script>

<template>
  <NuPageHeader title="Coupons" subtitle="Discount codes for checkout." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Billing' }, { label: 'Coupons' }]">
    <NuButton :icon="Plus" @click="open()">New coupon</NuButton>
  </NuPageHeader>

  <NuCard flush>
    <NuTable :columns="columns" :rows="rows" row-key="id" searchable search-placeholder="Search codes…" :page-size="10">
      <template #toolbar>
        <NuSegmented v-model="filter" size="sm" label="State" :options="['all', 'Active', 'Scheduled', 'Expired', 'Disabled'].map((s) => ({ label: s === 'all' ? 'All' : s, value: s }))" />
      </template>
      <template #cell-code="{ row }">
        <span class="nu-cluster" style="flex-wrap: nowrap; --nu-gap: 4px">
          <code class="coupon-code">{{ row.code }}</code>
          <NuButton size="sm" variant="ghost" color="secondary" :icon="Copy" square :aria-label="`Copy ${row.code}`" @click="copy(row.code)" />
        </span>
        <div v-if="row.newOnly" class="nu-text-sm nu-text-muted">New customers only</div>
      </template>
      <template #cell-value="{ row }">{{ value(row as Coupon) }}</template>
      <template #cell-uses="{ row }">
        <NuProgress v-if="row.limit" :value="row.uses" :max="row.limit" :height="5" :label="`${row.uses} / ${row.limit}`" show-value />
        <span v-else class="nu-tabular">{{ row.uses }} uses</span>
      </template>
      <template #cell-active="{ row }"><NuBadge :color="stateColor[stateOf(row as Coupon)]" dot>{{ stateOf(row as Coupon) }}</NuBadge></template>
      <template #cell-actions="{ row }">
        <NuButton size="sm" variant="ghost" color="secondary" :icon="Pencil" square :aria-label="`Edit ${row.code}`" @click="open(row as Coupon)" />
        <NuButton size="sm" variant="ghost" color="danger" :icon="Trash2" square :aria-label="`Delete ${row.code}`" @click="remove(row as Coupon)" />
      </template>
    </NuTable>
  </NuCard>

  <NuDrawer v-model="drawer" :title="editing ? `Edit ${editing.code}` : 'New coupon'">
    <form id="coupon-form" class="nu-stack" style="--nu-gap: 12px" novalidate @submit.prevent="save">
      <div class="coupon-code-row">
        <NuInput v-bind="form.field('code')" label="Code" placeholder="SUMMER25" style="flex: 1" @update:model-value="form.values.code = String($event ?? '').toUpperCase()" />
        <NuButton variant="outline" color="secondary" :icon="Shuffle" square aria-label="Generate a random code" @click="generate" />
      </div>
      <div>
        <div class="nu-field__label" style="margin-bottom: 4px">Discount type</div>
        <NuSegmented v-model="form.values.type" block label="Discount type" :options="[{ label: 'Percentage', value: 'percent' }, { label: 'Fixed amount', value: 'fixed' }]" />
      </div>
      <NuNumberInput v-bind="form.field('value')" :label="form.values.type === 'percent' ? 'Percent off' : 'Amount off'" :suffix="form.values.type === 'percent' ? '%' : undefined" :prefix="form.values.type === 'fixed' ? 'Rp' : undefined" :min="1" :step="form.values.type === 'percent' ? 5 : 5000" />
      <NuNumberInput v-model="form.values.limit" label="Usage limit" hint="Leave empty for unlimited" :min="1" />
      <NuDatePicker v-model="form.values.dates" range clearable label="Valid between" placeholder="Always valid" />
      <NuSwitch v-model="form.values.newOnly" label="New customers only" />
      <NuSwitch v-model="form.values.active" label="Active" />
    </form>
    <template #footer="{ close }">
      <NuButton variant="ghost" color="secondary" @click="close">Cancel</NuButton>
      <NuButton type="submit" form="coupon-form">Save coupon</NuButton>
    </template>
  </NuDrawer>
</template>

<style>
.coupon-code { padding: 2px 6px; border: 1px dashed var(--nu-border); font-weight: 700; letter-spacing: 0.04em; }
.coupon-code-row { display: flex; align-items: flex-end; gap: 6px; }
</style>
