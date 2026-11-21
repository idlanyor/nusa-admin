<script setup lang="ts">
import { computed, ref } from 'vue'
import { RefreshCw, RotateCcw } from 'lucide-vue-next'
import {
  NuBadge, NuButton, NuCard, NuDescriptions, NuDrawer, NuInfoBox, NuPageHeader, NuSecretField, NuSegmented, NuTable, NuTabs, useConfirm, useToast,
  type NuTableColumn,
} from 'nusa-admin'

type Status = 'Delivered' | 'Failed' | 'Retrying'
interface Delivery { id: string; at: string; event: string; endpoint: string; status: Status; code: number | null; ms: number; attempts: number; payload: object; response: string }
const toast = useToast()
const { confirm } = useConfirm()
const events = ['invoice.paid', 'order.created', 'user.updated', 'subscription.renewed', 'invoice.failed']
const endpoints = ['https://erp.example.com/hooks/nusa', 'https://hooks.zapier.com/hooks/catch/12345/abcde']
const deliveries = ref<Delivery[]>(
  Array.from({ length: 36 }, (_, i) => {
    const d = new Date(Date.now() - i * 37 * 60000)
    const failed = i % 7 === 2 || i % 11 === 5
    const retrying = i === 1
    const event = events[i % events.length]!
    const code = retrying ? null : failed ? (i % 2 ? 500 : 404) : 200
    return {
      id: `evt_${(9e5 - i * 7919).toString(36)}`,
      at: d.toISOString().slice(0, 19).replace('T', ' '),
      event,
      endpoint: endpoints[i % 2]!,
      status: retrying ? 'Retrying' : failed ? 'Failed' : 'Delivered',
      code,
      ms: failed ? 3000 + i * 13 : 80 + ((i * 37) % 300),
      attempts: failed ? 3 : retrying ? 2 : 1,
      payload: { id: `evt_${i}`, type: event, created: Math.floor(d.getTime() / 1000), data: { object: { id: `inv_${2041 - i}`, amount: 23700, currency: 'usd', customer: 'cus_ayu' } } },
      response: failed ? (code === 404 ? '{"error":"Not Found"}' : '<html>502 Bad Gateway</html>') : '{"ok":true}',
    }
  }),
)
const filter = ref('all')
const rows = computed(() => deliveries.value.filter((d) => filter.value === 'all' || d.status === filter.value))
const stat = (s: Status) => deliveries.value.filter((d) => d.status === s).length
const rate = computed(() => Math.round((stat('Delivered') / deliveries.value.length) * 100))
const statusColor = { Delivered: 'success', Failed: 'danger', Retrying: 'warning' } as const
const columns: NuTableColumn<Delivery>[] = [
  { key: 'event', label: 'Event', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'code', label: 'HTTP', align: 'right' },
  { key: 'ms', label: 'Time', align: 'right', sortable: true, format: (v) => `${v} ms` },
  { key: 'at', label: 'Sent', sortable: true },
]
const open = ref<Delivery | null>(null)
const tab = ref('payload')

function resend(d: Delivery) {
  d.status = 'Retrying'
  d.code = null
  setTimeout(() => {
    d.status = 'Delivered'
    d.code = 200
    d.ms = 142
    d.attempts++
    d.response = '{"ok":true}'
    toast.success(`${d.id} delivered.`)
  }, 1200)
}
async function resendFailed() {
  const failed = deliveries.value.filter((d) => d.status === 'Failed')
  if (!failed.length) return
  if (await confirm({ title: `Resend ${failed.length} failed deliveries?`, message: 'Each is sent again with its original payload.', confirmLabel: 'Resend all' })) failed.forEach(resend)
}
</script>

<template>
  <NuPageHeader title="Webhooks" subtitle="Outgoing event deliveries to your endpoints." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Developers' }, { label: 'Webhooks' }]">
    <NuButton variant="outline" color="secondary" :icon="RotateCcw" :disabled="!stat('Failed')" @click="resendFailed">Resend failed</NuButton>
  </NuPageHeader>

  <div class="nu-stack">
    <div class="nu-row">
      <div class="nu-col-sm-6 nu-col-lg-3"><NuInfoBox label="Success rate (24 h)" :value="`${rate}%`" color="success" :progress="rate" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuInfoBox label="Delivered" :value="stat('Delivered')" color="info" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuInfoBox label="Failed" :value="stat('Failed')" color="danger" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuCard title="Signing secret"><NuSecretField value="whsec_6Y2k9fQ1aZ8Lm4Rt0Vx3" /></NuCard></div>
    </div>

    <NuCard flush>
      <NuTable :columns="columns" :rows="rows" row-key="id" searchable search-placeholder="Search events…" :page-size="10" dense>
        <template #toolbar>
          <NuSegmented v-model="filter" size="sm" label="Status" :options="[{ label: 'All', value: 'all' }, { label: 'Delivered', value: 'Delivered' }, { label: 'Failed', value: 'Failed' }, { label: 'Retrying', value: 'Retrying' }]" />
        </template>
        <template #cell-event="{ row }">
          <button type="button" class="audit-link" @click="open = row as Delivery; tab = 'payload'"><code>{{ row.event }}</code></button>
          <div class="nu-text-sm nu-text-muted nu-truncate" style="max-width: 320px">{{ row.endpoint }}</div>
        </template>
        <template #cell-status="{ row }"><NuBadge :color="statusColor[(row as Delivery).status]" dot>{{ row.status }}</NuBadge></template>
        <template #cell-code="{ row }"><code v-if="row.code" :style="{ color: row.code >= 400 ? 'var(--nu-danger)' : undefined }">{{ row.code }}</code><span v-else class="nu-text-muted">—</span></template>
      </NuTable>
    </NuCard>
  </div>

  <NuDrawer :model-value="!!open" :title="open?.event" width="520px" @update:model-value="!$event && (open = null)">
    <template v-if="open">
      <NuDescriptions
        :columns="2"
        :items="[
          { label: 'Event ID', value: open.id },
          { label: 'Status', key: 'status' },
          { label: 'Sent', value: open.at },
          { label: 'Attempts', value: open.attempts },
          { label: 'Response', value: open.code ? `${open.code} in ${open.ms} ms` : 'Pending' },
          { label: 'Endpoint', value: open.endpoint },
        ]"
      >
        <template #status><NuBadge :color="statusColor[open.status]" dot>{{ open.status }}</NuBadge></template>
      </NuDescriptions>
      <NuTabs v-model="tab" :tabs="[{ key: 'payload', label: 'Payload' }, { key: 'response', label: 'Response' }, { key: 'headers', label: 'Headers' }]" style="margin-top: 12px">
        <template #payload><pre class="code">{{ JSON.stringify(open.payload, null, 2) }}</pre></template>
        <template #response><pre class="code">{{ open.response }}</pre></template>
        <template #headers><pre class="code">content-type: application/json&#10;user-agent: Nusa-Webhooks/1.0&#10;nusa-signature: t={{ Math.floor(Date.now() / 1000) }},v1=5f2c…a91e</pre></template>
      </NuTabs>
    </template>
    <template #footer>
      <NuButton :icon="RefreshCw" :disabled="open?.status === 'Retrying'" @click="open && resend(open)">Resend</NuButton>
    </template>
  </NuDrawer>
</template>
