<script setup lang="ts">
import { ref } from 'vue'
import { Building2, Filter, Folder, User, Users } from 'lucide-vue-next'
import {
  NuButton, NuCard, NuCheckbox, NuColorPicker, NuHeatmap, NuNumberInput, NuPageHeader, NuPinInput, NuPopover, NuSelect, NuTreeView,
  type NuTreeNode,
} from 'nusa-admin'
import { activity } from '../../data'

const qty = ref<number | null>(2)
const price = ref<number | null>(19.9)
const discount = ref<number | null>(10)
const pin = ref('')
const done = ref('')
const color = ref('#0d9488')
const node = ref<string | number | null>('eng')
const status = ref('any')
const onlyMine = ref(false)
const org: NuTreeNode[] = [
  {
    id: 'co', label: 'Nusa Digital', icon: Building2, meta: '48', children: [
      { id: 'eng', label: 'Engineering', icon: Users, meta: '21', children: [{ id: 'fe', label: 'Frontend', icon: Folder, meta: '8' }, { id: 'be', label: 'Backend', icon: Folder, meta: '9' }, { id: 'ops', label: 'DevOps', icon: Folder, meta: '4' }] },
      { id: 'design', label: 'Design', icon: Users, meta: '7' },
      { id: 'sales', label: 'Sales', icon: Users, meta: '12', children: [{ id: 'ayu', label: 'Ayu Lestari', icon: User }] },
    ],
  },
]
const heat = activity(182, 3)
</script>

<template>
  <NuPageHeader title="More inputs" subtitle="Popover, number and PIN inputs, tree view, color picker and heatmap." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'UI Elements' }, { label: 'More inputs' }]" />

  <div class="nu-row">
    <div class="nu-col-lg-6 nu-stack">
      <NuCard title="Number input">
        <div class="nu-row" style="--nu-gap: 12px">
          <div class="nu-col-md-4"><NuNumberInput v-model="qty" label="Quantity" :min="1" :max="99" /></div>
          <div class="nu-col-md-4"><NuNumberInput v-model="price" label="Price" :min="0" :step="0.1" prefix="$" /></div>
          <div class="nu-col-md-4"><NuNumberInput v-model="discount" label="Discount" :min="0" :max="100" :step="5" suffix="%" /></div>
        </div>
        <p class="nu-text-sm nu-text-muted" style="margin-top: 8px">Total: ${{ (((qty ?? 0) * (price ?? 0) * (100 - (discount ?? 0))) / 100).toFixed(2) }} · ↑/↓ keys step the value.</p>
      </NuCard>

      <NuCard title="PIN / one-time code">
        <NuPinInput v-model="pin" label="6-digit code" @complete="done = $event" />
        <p class="nu-text-sm nu-text-muted" style="margin-top: 8px">{{ done ? `complete: ${done}` : 'Type or paste a code.' }} Used on <RouterLink to="/auth/two-factor">Two-step verification</RouterLink>.</p>
      </NuCard>

      <NuCard title="Popover">
        <div class="nu-cluster">
          <NuPopover title="Filter orders">
            <template #trigger><NuButton variant="outline" color="secondary" :icon="Filter">Filters</NuButton></template>
            <template #default="{ close }">
              <div class="nu-stack" style="--nu-gap: 10px">
                <NuSelect v-model="status" label="Status" :options="[{ label: 'Any', value: 'any' }, { label: 'Paid', value: 'paid' }, { label: 'Pending', value: 'pending' }]" />
                <NuCheckbox v-model="onlyMine" label="Only my orders" />
                <div class="nu-cluster" style="justify-content: flex-end">
                  <NuButton size="sm" variant="ghost" color="secondary" @click="close()">Cancel</NuButton>
                  <NuButton size="sm" @click="close()">Apply</NuButton>
                </div>
              </div>
            </template>
          </NuPopover>
          <NuPopover placement="bottom-end" width="240px">
            <template #trigger><NuButton variant="soft">Details</NuButton></template>
            <p class="nu-text-sm">Popovers hold rich content; tooltips are for short hints. Escape or an outside click closes them.</p>
          </NuPopover>
        </div>
      </NuCard>
    </div>

    <div class="nu-col-lg-6 nu-stack">
      <NuCard title="Tree view" subtitle="↑↓ move · → open · ← close · Enter select" flush>
        <NuTreeView v-model="node" :nodes="org" :default-expanded="['co', 'eng']" label="Organisation" />
        <template #footer><span class="nu-text-sm nu-text-muted">Selected: {{ node }}</span></template>
      </NuCard>

      <NuCard title="Color picker">
        <NuColorPicker v-model="color" label="Brand color" hint="Pick a swatch, use the native picker, or type a hex value." />
        <div class="color-preview" :style="{ background: color }">{{ color }}</div>
      </NuCard>
    </div>

    <div class="nu-col-12">
      <NuCard title="Heatmap" subtitle="Deployments per day">
        <NuHeatmap :values="heat" unit="deploys" label="Deployments" />
      </NuCard>
    </div>
  </div>
</template>

<style>
.color-preview { margin-top: 10px; padding: 10px; border-radius: var(--nu-radius-sm); color: #fff; font-family: var(--nu-font-mono); font-size: 12.5px; }
</style>
