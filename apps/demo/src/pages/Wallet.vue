<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowDownLeft, ArrowUpRight, Building2, CreditCard, QrCode, Wallet } from 'lucide-vue-next'
import { NuBadge, NuButton, NuCard, NuChart, NuInfoBox, NuNumberInput, NuPageHeader, NuSegmented, NuTable, useToast, type NuTableColumn } from 'nusa-admin'

interface Tx { id: string; at: string; kind: 'topup' | 'charge' | 'refund'; note: string; amount: number; status: 'Completed' | 'Pending' | 'Failed' }
const toast = useToast()
const idr = (v: number) => `Rp${Math.abs(v).toLocaleString('id-ID')}`
const balance = ref(1_250_000)
const presets = [50_000, 100_000, 250_000, 500_000, 1_000_000]
const amount = ref<number | null>(250_000)
const method = ref('qris')
const methods = [
  { value: 'qris', label: 'QRIS', icon: QrCode, help: 'Any e-wallet or banking app · instant' },
  { value: 'va', label: 'Virtual account', icon: Building2, help: 'BCA, Mandiri, BNI, BRI · ~5 min' },
  { value: 'card', label: 'Card', icon: CreditCard, help: 'Visa, Mastercard · +2.9% fee' },
]
const fee = computed(() => (method.value === 'card' ? Math.round((amount.value ?? 0) * 0.029) : 0))
const MIN = 10_000
const MAX = 10_000_000
const valid = computed(() => !!amount.value && amount.value >= MIN && amount.value <= MAX)

const txs = ref<Tx[]>([
  { id: 'TX-9812', at: '2026-11-21 08:02', kind: 'charge', note: 'Team plan renewal', amount: -237_000, status: 'Completed' },
  { id: 'TX-9807', at: '2026-11-18 19:44', kind: 'topup', note: 'Top-up via QRIS', amount: 500_000, status: 'Completed' },
  { id: 'TX-9790', at: '2026-11-12 10:15', kind: 'refund', note: 'Refund — order #4820', amount: 24_000, status: 'Completed' },
  { id: 'TX-9781', at: '2026-11-09 14:30', kind: 'charge', note: 'Add-on: Storage', amount: -12_000, status: 'Completed' },
  { id: 'TX-9770', at: '2026-11-05 09:01', kind: 'topup', note: 'Top-up via virtual account', amount: 1_000_000, status: 'Failed' },
])
const columns: NuTableColumn<Tx>[] = [
  { key: 'at', label: 'Date', sortable: true },
  { key: 'note', label: 'Description' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount', align: 'right', sortable: true },
]
const statusColor = { Completed: 'success', Pending: 'warning', Failed: 'danger' } as const

function pay() {
  if (!valid.value) return
  const id = `TX-${9813 + txs.value.length}`
  txs.value.unshift({ id, at: new Date().toISOString().slice(0, 16).replace('T', ' '), kind: 'topup', note: `Top-up via ${methods.find((m) => m.value === method.value)!.label}`, amount: amount.value!, status: 'Pending' })
  toast.info({ title: 'Waiting for payment', message: `${idr(amount.value! + fee.value)} · ${id}. It settles in a few seconds (demo).` })
  setTimeout(() => {
    const tx = txs.value.find((t) => t.id === id)
    if (tx) tx.status = 'Completed'
    balance.value += amount.value ?? 0
    toast.success(`Balance topped up by ${idr(tx?.amount ?? 0)}.`)
  }, 2500)
}
</script>

<template>
  <NuPageHeader title="Wallet" subtitle="Prepaid balance used for renewals and add-ons." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Billing' }, { label: 'Wallet' }]" />

  <div class="nu-row">
    <div class="nu-col-lg-7 nu-stack">
      <div class="nu-row">
        <div class="nu-col-sm-6"><NuInfoBox label="Current balance" :value="idr(balance)" :icon="Wallet" color="success" description="Enough for ~5 months of renewals" /></div>
        <div class="nu-col-sm-6"><NuInfoBox label="Spent this month" value="Rp249.000" :icon="ArrowUpRight" color="warning" :progress="25" description="25% of your Rp1.000.000 budget" /></div>
      </div>
      <NuCard title="Balance history" subtitle="Last 6 months">
        <NuChart type="area" :labels="['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']" :series="[{ name: 'Balance', data: [400, 620, 510, 890, 760, 1250].map((v) => v * 1000) }]" :format="(v) => `Rp${Math.round(v / 1000)}K`" :height="200" />
      </NuCard>
      <NuCard title="Transactions" flush>
        <NuTable :columns="columns" :rows="txs" row-key="id" :page-size="6" exportable="transactions.csv">
          <template #cell-note="{ row }">
            <span class="nu-cluster" style="flex-wrap: nowrap; --nu-gap: 8px">
              <span class="tx-dot" :class="(row as Tx).amount < 0 ? 'is-out' : 'is-in'"><component :is="(row as Tx).amount < 0 ? ArrowUpRight : ArrowDownLeft" /></span>
              <span>{{ row.note }}<br /><small class="nu-text-muted">{{ row.id }}</small></span>
            </span>
          </template>
          <template #cell-status="{ row }"><NuBadge :color="statusColor[(row as Tx).status]">{{ row.status }}</NuBadge></template>
          <template #cell-amount="{ row }"><strong class="nu-tabular" :style="{ color: row.amount > 0 ? 'var(--nu-success)' : undefined }">{{ row.amount > 0 ? '+' : '−' }}{{ idr(row.amount) }}</strong></template>
        </NuTable>
      </NuCard>
    </div>

    <div class="nu-col-lg-5">
      <NuCard title="Top up" accent="primary">
        <form class="nu-stack" style="--nu-gap: 14px" @submit.prevent="pay">
          <div>
            <div class="nu-field__label" style="margin-bottom: 6px">Amount</div>
            <div class="presets">
              <button v-for="p in presets" :key="p" type="button" class="preset" :class="{ 'is-on': amount === p }" :aria-pressed="amount === p" @click="amount = p">{{ idr(p) }}</button>
            </div>
          </div>
          <NuNumberInput v-model="amount" label="Or enter an amount" prefix="Rp" :min="MIN" :max="MAX" :step="10000" :hint="`Min ${idr(MIN)} · max ${idr(MAX)}`" />
          <div>
            <div class="nu-field__label" style="margin-bottom: 6px">Payment method</div>
            <NuSegmented v-model="method" block label="Payment method" :options="methods.map((m) => ({ label: m.label, value: m.value }))" />
            <p class="nu-text-sm nu-text-muted" style="margin-top: 6px">{{ methods.find((m) => m.value === method)?.help }}</p>
          </div>
          <dl class="summary">
            <div><dt>Top-up</dt><dd>{{ idr(amount ?? 0) }}</dd></div>
            <div><dt>Fee</dt><dd>{{ fee ? idr(fee) : 'Free' }}</dd></div>
            <div class="is-total"><dt>You pay</dt><dd>{{ idr((amount ?? 0) + fee) }}</dd></div>
          </dl>
          <NuButton type="submit" size="lg" block :disabled="!valid">Continue to payment</NuButton>
        </form>
      </NuCard>
    </div>
  </div>
</template>

<style>
.presets { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 6px; }
.preset { height: 34px; border: 1px solid var(--nu-border); border-radius: var(--nu-radius-sm); background: var(--nu-surface); color: var(--nu-text); font-weight: 600; font-variant-numeric: tabular-nums; cursor: pointer; }
.preset:hover { border-color: color-mix(in srgb, var(--nu-primary) 50%, var(--nu-border)); }
.preset.is-on { border-color: var(--nu-primary); background: color-mix(in srgb, var(--nu-primary) 10%, transparent); color: var(--nu-primary); }
.summary { display: grid; gap: 4px; margin: 0; padding: 10px 12px; border-radius: var(--nu-radius-sm); background: var(--nu-surface-2); font-size: 13.5px; }
.summary > div { display: flex; justify-content: space-between; }
.summary dt { color: var(--nu-text-muted); }
.summary dd { margin: 0; font-variant-numeric: tabular-nums; }
.summary .is-total { padding-top: 6px; border-top: 1px solid var(--nu-border); font-weight: 700; }
.summary .is-total dt { color: var(--nu-text); }
.tx-dot { display: grid; place-items: center; flex: none; width: 26px; height: 26px; border-radius: 50%; border: 1px solid currentColor; }
.tx-dot svg { width: 13px; height: 13px; }
.tx-dot.is-in { color: var(--nu-success); }
.tx-dot.is-out { color: var(--nu-danger); }
</style>
